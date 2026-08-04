// api/parse.js — POST { text } -> parsed items + mechanical total (composer live preview)
import { fetchCompareItem } from '../lib/silkdb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const text = req.body && req.body.text ? String(req.body.text) : '';
  const parts = text.split('+').map(s => s.trim()).filter(Boolean).slice(0, 12);
  if (!parts.length) return res.status(200).json({ items: [], totalKeys: 0, anyOk: false });
  try {
    const results = await Promise.all(parts.map(fetchCompareItem));
    const totalKeys = results.reduce((s, r) => s + (r.keys || 0), 0);
    return res.status(200).json({
      items: results.map(r => ({ name: r.displayName, keys: r.keys, ok: !r.error })),
      totalKeys,
      anyOk: results.some(r => !r.error)
    });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
