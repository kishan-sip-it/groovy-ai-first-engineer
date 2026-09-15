import { availableProviders, resolveProvider, stream } from '../src/providers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const input = String(body.input || '').trim();
    if (!input) return res.status(400).json({ error: 'input is required' });
    if (input.length > 8000) return res.status(400).json({ error: 'input is too long' });
    const provider = resolveProvider(String(body.provider || 'auto'));
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    for await (const chunk of stream(provider, input, { model: body.model, maxTokens: Number(body.maxTokens) || undefined })) res.write(`data: ${JSON.stringify({ chunk, provider })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true, provider, availableProviders: availableProviders() })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'AI stream failed', availableProviders: availableProviders() })}\n\n`);
    res.end();
  }
}
