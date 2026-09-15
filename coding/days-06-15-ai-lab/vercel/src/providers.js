import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { withExponentialBackoff } from './retry.js';

const cfg = {
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
};

const clients = {};
if (process.env.ANTHROPIC_API_KEY) clients.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0 });
if (process.env.OPENAI_API_KEY) clients.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0 });
if (process.env.GEMINI_API_KEY) clients.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
if (process.env.GROQ_API_KEY) clients.groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1', maxRetries: 0 });

const order = ['groq', 'openai', 'anthropic', 'gemini'];
export function availableProviders() {
  const configured = order.filter(name => clients[name]);
  return configured.length ? configured : ['mock'];
}
export function resolveProvider(requested) {
  if (requested && requested !== 'auto' && (requested === 'mock' || clients[requested])) return requested;
  return availableProviders()[0] || 'mock';
}

export async function complete(provider, input, options = {}) {
  provider = resolveProvider(provider);
  if (provider === 'mock') return { text: `[MOCK MODE] Received: ${input}\nConfigure a provider key for live output.`, usage: { input_tokens: input.length, output_tokens: 18 } };
  if (provider === 'anthropic') {
    return withExponentialBackoff(async () => {
      const response = await clients.anthropic.messages.create({ model: options.model || cfg.anthropicModel, max_tokens: options.maxTokens || 1024, messages: [{ role: 'user', content: input }] });
      return { text: response.content.filter(b => b.type === 'text').map(b => b.text).join(''), usage: response.usage || {} };
    });
  }
  if (provider === 'gemini') {
    return withExponentialBackoff(async () => {
      const response = await clients.gemini.models.generateContent({ model: options.model || cfg.geminiModel, contents: input });
      return { text: response.text || '', usage: response.usageMetadata || {} };
    });
  }
  const client = clients[provider];
  if (!client) throw new Error(`Provider ${provider} is not configured`);
  const model = options.model || (provider === 'groq' ? cfg.groqModel : cfg.openaiModel);
  return withExponentialBackoff(async () => {
    const response = await client.responses.create({ model, input, max_output_tokens: options.maxTokens || undefined });
    return { text: response.output_text || '', usage: response.usage || {} };
  });
}

export async function* stream(provider, input, options = {}) {
  provider = resolveProvider(provider);
  if (provider === 'mock') {
    for (const word of (`[MOCK MODE] ${input}`).split(/\s+/)) { yield `${word} `; await new Promise(r => setTimeout(r, 8)); }
    return;
  }
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
  const client = clients[provider];
  if (!client) throw new Error(`Provider ${provider} is not configured`);
  const s = await withExponentialBackoff(() => client.responses.create({ model: options.model || (provider === 'groq' ? cfg.groqModel : cfg.openaiModel), input, stream: true }));
  for await (const event of s) if (event.type === 'response.output_text.delta') yield event.delta;
}
