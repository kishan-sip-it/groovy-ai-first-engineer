import { availableProviders, complete, resolveProvider } from '../src/providers.js';

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ ok: true, providers: availableProviders(), defaultProvider: availableProviders()[0], timestamp: new Date().toISOString() });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const input = String(body.input || '').trim();
    if (!input) return res.status(400).json({ error: 'input is required' });
    if (input.length > 8000) return res.status(400).json({ error: 'input is too long' });
    const requested = String(body.provider || 'auto');
    const provider = resolveProvider(requested);
    const result = await complete(provider, input, { model: body.model, maxTokens: Number(body.maxTokens) || undefined });
    return res.status(200).json({ ...result, provider, requestedProvider: requested, availableProviders: availableProviders() });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'AI request failed', providers: availableProviders() });
  }
}
