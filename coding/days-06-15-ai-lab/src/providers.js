import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { withExponentialBackoff } from './retry.js';

const cfg = {
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash'
};
const clients = {};
if (process.env.ANTHROPIC_API_KEY) clients.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0 });
if (process.env.OPENAI_API_KEY) clients.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0 });
if (process.env.GEMINI_API_KEY) clients.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function availableProviders(){
  const configured = Object.keys(clients);
  return configured.length ? configured : ['mock'];
}

export async function complete(provider, input, options = {}) {
  if (provider === 'mock') {
    return {
      text: `[MOCK MODE] Received: ${input}\nUse a real provider key when live model output is required.`,
      usage: { input_tokens: input.length, output_tokens: 18 }
    };
  }
  if (provider === 'anthropic') {
    if (!clients.anthropic) throw new Error('ANTHROPIC_API_KEY is not configured');
    return withExponentialBackoff(async()=>{const response=await clients.anthropic.messages.create({model:options.model||cfg.anthropicModel,max_tokens:options.maxTokens||1024,messages:[{role:'user',content:input}]});return{text:response.content.filter(b=>b.type==='text').map(b=>b.text).join(''),usage:response.usage||{}}});
  }
  if (provider === 'openai') {
    if (!clients.openai) throw new Error('OPENAI_API_KEY is not configured');
    return withExponentialBackoff(async()=>{const response=await clients.openai.responses.create({model:options.model||cfg.openaiModel,input});return{text:response.output_text||'',usage:response.usage||{}}});
  }
  if (provider === 'gemini') {
    if (!clients.gemini) throw new Error('GEMINI_API_KEY is not configured');
    return withExponentialBackoff(async()=>{const response=await clients.gemini.models.generateContent({model:options.model||cfg.geminiModel,contents:input});return{text:response.text||'',usage:response.usageMetadata||{}}});
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

export async function* stream(provider,input,options={}){
  if(provider==='mock'){
    const text = `[MOCK MODE] ${input}`;
    for (const word of text.split(/\s+/)) { yield `${word} `; await new Promise(resolve => setTimeout(resolve, 8)); }
    return;
  }
  if(provider==='anthropic'){
    if(!clients.anthropic)throw new Error('ANTHROPIC_API_KEY is not configured');
    const s=await withExponentialBackoff(()=>clients.anthropic.messages.create({model:options.model||cfg.anthropicModel,max_tokens:options.maxTokens||1024,messages:[{role:'user',content:input}],stream:true}));
    for await(const event of s)if(event.type==='content_block_delta'&&event.delta?.type==='text_delta')yield event.delta.text;return;
  }
  if(provider==='gemini'){
    if(!clients.gemini)throw new Error('GEMINI_API_KEY is not configured');
    const s=await withExponentialBackoff(()=>clients.gemini.models.generateContentStream({model:options.model||cfg.geminiModel,contents:input}));
    for await(const chunk of s)if(chunk.text)yield chunk.text;return;
  }
  if(provider==='openai'){
    if(!clients.openai)throw new Error('OPENAI_API_KEY is not configured');
    const s=await withExponentialBackoff(()=>clients.openai.responses.create({model:options.model||cfg.openaiModel,input,stream:true}));
    for await(const event of s)if(event.type==='response.output_text.delta')yield event.delta;return;
  }
  throw new Error(`Unsupported provider: ${provider}`);
}
