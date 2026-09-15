export async function withExponentialBackoff(fn, { retries = Number(process.env.AI_LAB_MAX_RETRIES || 3), baseMs = 400 } = {}) {
  let last;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try { return await fn(); }
    catch (error) {
      last = error;
      const status = error?.status || error?.statusCode;
      const retryable = [408, 409, 429].includes(status) || (status >= 500);
      if (attempt === retries || !retryable) throw error;
      const jitter = Math.floor(Math.random() * 100);
      await new Promise(r => setTimeout(r, baseMs * 2 ** attempt + jitter));
    }
  }
  throw last;
}
