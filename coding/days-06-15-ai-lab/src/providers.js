import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { withExponentialBackoff } from './retry.js';

const cfg = {
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
};

const clients = {};
if (process.env.ANTHROPIC_API_KEY) clients.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0 });
if (process.env.OPENAI_API_KEY) clients.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0 });
if (process.env.GEMINI_API_KEY) clients.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function availableProviders() {
  const configured = [];
  if (process.env.GROQ_API_KEY) configured.push('groq');
  if (clients.anthropic) configured.push('anthropic');
  if (clients.openai) configured.push('openai');
  if (clients.gemini) configured.push('gemini');
  return configured.length ? configured : ['mock'];
}

function resolveProvider(provider) {
  if (provider === 'groq') return 'groq';
  if (provider === 'anthropic' && clients.anthropic) return 'anthropic';
  if (provider === 'openai' && clients.openai) return 'openai';
  if (provider === 'gemini' && clients.gemini) return 'gemini';
  // Graceful fallback: when a requested provider is not configured but Groq is,
  // use Groq instead of surfacing a raw *_API_KEY configuration error.
  if (process.env.GROQ_API_KEY) return 'groq';
  return provider;
}

async function groqComplete(input, options = {}) {
  if (!process.env.GROQ_API_KEY) throw new Error('No live AI provider is configured');
  return withExponentialBackoff(async () => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: options.model || cfg.groqModel,
        messages: [{ role: 'user', content: input }],
        max_tokens: options.maxTokens || 1024
      })
    });
    if (!response.ok) throw Object.assign(new Error(`AI request failed (${response.status})`), { status: response.status });
    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || '', usage: data.usage || {} };
  });
}

export async function complete(provider, input, options = {}) {
  provider = resolveProvider(provider);
  if (provider === 'mock') {
    return { text: `[DEMO MODE] Received: ${input}\nAdd a live provider key to enable real model output.`, usage: { input_tokens: input.length, output_tokens: 18 } };
  }
  if (provider === 'groq') return groqComplete(input, options);

  if (provider === 'anthropic') {
    return withExponentialBackoff(async () => {
      const response = await clients.anthropic.messages.create({ model: options.model || cfg.anthropicModel, max_tokens: options.maxTokens || 1024, messages: [{ role: 'user', content: input }] });
      return { text: response.content.filter(b => b.type === 'text').map(b => b.text).join(''), usage: response.usage || {} };
    });
  }
  if (provider === 'openai') {
    return withExponentialBackoff(async () => {
      const response = await clients.openai.responses.create({ model: options.model || cfg.openaiModel, input });
      return { text: response.output_text || '', usage: response.usage || {} };
    });
  }
  if (provider === 'gemini') {
    return withExponentialBackoff(async () => {
      const response = await clients.gemini.models.generateContent({ model: options.model || cfg.geminiModel, contents: input });
      return { text: response.text || '', usage: response.usageMetadata || {} };
    });
  }
  throw new Error('Unsupported AI provider');
}

async function* groqStream(input, options = {}) {
  if (!process.env.GROQ_API_KEY) {
    for (const word of '[DEMO MODE] No live AI provider is configured.'.split(/\s+/)) {
      yield `${word} `;
      await new Promise(resolve => setTimeout(resolve, 8));
    }
    return;
  }
  const response = await withExponentialBackoff(() => fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: options.model || cfg.groqModel, messages: [{ role: 'user', content: input }], max_tokens: options.maxTokens || 1024, stream: true })
  }));
  if (!response.ok || !response.body) throw new Error(`AI request failed (${response.status})`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() || '';
    for (const event of events) {
      const line = event.split('\n').find(item => item.startsWith('data: '));
      if (!line) continue;
      const payload = line.slice(6);
      if (payload === '[DONE]') return;
      try {
        const data = JSON.parse(payload);
        const text = data.choices?.[0]?.delta?.content;
        if (text) yield text;
      } catch {}
    }
  }
}

export async function* stream(provider, input, options = {}) {
  provider = resolveProvider(provider);
  if (provider === 'mock') {
    for (const word of `[DEMO MODE] ${input}`.split(/\s+/)) { yield `${word} `; await new Promise(resolve => setTimeout(resolve, 8)); }
    return;
  }
  if (provider === 'groq') { yield* groqStream(input, options); return; }
  if (provider === 'anthropic') {
    const s = await withExponentialBackoff(() => clients.anthropic.messages.create({ model: options.model || cfg.anthropicModel, max_tokens: options.maxTokens || 1024, messages: [{ role: 'user', content: input }], stream: true }));
    for await (const event of s) if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') yield event.delta.text;
    return;
  }
  if (provider === 'gemini') {
    const s = await withExponentialBackoff(() => clients.gemini.models.generateContentStream({ model: options.model || cfg.geminiModel, contents: input }));
    for await (const chunk of s) if (chunk.text) yield chunk.text;
    return;
  }
  if (provider === 'openai') {
    const s = await withExponentialBackoff(() => clients.openai.responses.create({ model: options.model || cfg.openaiModel, input, stream: true }));
    for await (const event of s) if (event.type === 'response.output_text.delta') yield event.delta;
    return;
  }
  throw new Error('Unsupported AI provider');
}
