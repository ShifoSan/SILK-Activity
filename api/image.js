// api/image.js — server-side image proxy so Cloudinary loads inside the Discord iframe.
// Whitelisted hosts only, https only — cannot be abused as an open proxy.
const ALLOWED = new Set(['res.cloudinary.com', 'cdn.discordapp.com', 'media.discordapp.net']);

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  const raw = req.query && req.query.url ? String(req.query.url) : '';
  let parsed;
  try { parsed = new URL(raw); } catch { return res.status(400).end(); }
  if (parsed.protocol !== 'https:' || !ALLOWED.has(parsed.hostname)) return res.status(403).end();

  try {
    const up = await fetch(parsed.toString());
    if (!up.ok) return res.status(502).end();
    const buf = Buffer.from(await up.arrayBuffer());
    res.setHeader('Content-Type', up.headers.get('content-type') || 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(buf);
  } catch {
    return res.status(502).end();
  }
}
