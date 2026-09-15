import { stream } from '../src/providers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const input = String(body.input || '').trim();
    const provider = String(body.provider || 'mock');
    if (!input) return res.status(400).json({ error: 'input is required' });
    if (input.length > 8000) return res.status(400).json({ error: 'input is too long' });
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    for await (const chunk of stream(provider, input)) res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'AI stream failed' })}\n\n`);
    res.end();
  }
}
