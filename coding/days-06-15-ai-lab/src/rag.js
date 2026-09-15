import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import OpenAI from 'openai';
import { complete } from './providers.js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export function chunkText(text, { size = 1200, overlap = 200 } = {}) {
  const words = text.split(/\s+/).filter(Boolean), out = [];
  for (let i = 0; i < words.length; i += Math.max(1, size - overlap)) {
    out.push(words.slice(i, i + size).join(' '));
    if (i + size >= words.length) break;
  }
  return out;
}

function localEmbedding(text, dims = 128) {
  const v = new Array(dims).fill(0);
  for (const token of text.toLowerCase().split(/\W+/).filter(Boolean)) {
    let h = 2166136261;
    for (const c of token) {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    v[Math.abs(h) % dims] += 1;
  }
  const n = Math.hypot(...v) || 1;
  return v.map(x => x / n);
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(na) * Math.sqrt(nb)) || 1);
}

async function embed(texts) {
  if (!openai) return texts.map(t => localEmbedding(t));
  const r = await openai.embeddings.create({ model: 'text-embedding-3-small', input: texts });
  return r.data.map(x => x.embedding);
}

async function extractPdfText(buf) {
  const parser = new PDFParse({ data: buf });
  try {
    const parsed = await parser.getText();
    return parsed.text;
  } finally {
    await parser.destroy();
  }
}

export async function ingest(file) {
  const abs = path.resolve(file);
  const buf = await fs.readFile(abs);
  let text;

  if (file.toLowerCase().endsWith('.pdf')) {
    text = await extractPdfText(buf);
  } else {
    text = buf.toString('utf8');
  }

  const chunks = chunkText(text).map((text, index) => ({ id: index + 1, text, page: null }));
  const embeddings = await embed(chunks.map(c => c.text));
  return chunks.map((c, i) => ({ ...c, embedding: embeddings[i] }));
}

export async function answerQuestion(question, file) {
  if (!file) throw new Error('Provide --file path/to/document.pdf|txt|md');

  const chunks = await ingest(file);
  const q = (await embed([question]))[0];
  const top = chunks
    .map(c => ({ ...c, score: cosine(c.embedding, q) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = top.map(c => `[Source chunk ${c.id}] ${c.text}`).join('\n\n');
  const provider = Object.keys({
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY
  }).find(Boolean);

  if (!provider) return `No API key configured. Top retrieved chunks:\n\n${context}`;

  const prompt = `Answer the question using only the supplied source context. Cite source chunk numbers. If the answer is not present, say so.\n\nQuestion: ${question}\n\nContext:\n${context}`;
  const r = await complete(provider, prompt);
  return r.text;
}
