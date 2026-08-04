// api/compare.js — mechanical trade analytics, zero AI. Mirrors trade_compare.py.
import { fetchCompareItem } from '../lib/silkdb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const giving = req.body && req.body.giving ? String(req.body.giving) : '';
  const getting = req.body && req.body.getting ? String(req.body.getting) : '';
  const givingList = giving.split('+').map(s => s.trim()).filter(Boolean);
  const gettingList = getting.split('+').map(s => s.trim()).filter(Boolean);
  if (!givingList.length || !gettingList.length) return res.status(400).json({ error: 'invalid_format' });

  try {
    const [givingResults, gettingResults] = await Promise.all([
      Promise.all(givingList.map(fetchCompareItem)),
      Promise.all(gettingList.map(fetchCompareItem))
    ]);

    const accumulate = (results) => {
      const totals = { keys: 0, scrolls: 0, vizard: 0, gemsTax: 0, goldTax: 0 };
      const breakdown = [], unmatched = [];
      for (const r of results) {
        if (r.error === 'not_found') unmatched.push(r.displayName);
        totals.keys += r.keys; totals.scrolls += r.scrolls; totals.vizard += r.vizard;
        totals.gemsTax += r.gemsTax; totals.goldTax += r.goldTax;
        breakdown.push({ name: r.displayName, keys: r.keys });
      }
      return { totals, breakdown, unmatched };
    };
    const sideA = accumulate(givingResults);
    const sideB = accumulate(gettingResults);

    let ratio;
    if (sideA.totals.keys === 0) ratio = sideB.totals.keys > 0 ? 5.0 : 1.0;
    else ratio = sideB.totals.keys / sideA.totals.keys;

    let verdict;
    if (ratio >= 1.50) verdict = 'massive';
    else if (ratio >= 1.10) verdict = 'profit';
    else if (ratio > 0.90) verdict = 'fair';
    else if (ratio >= 0.60) verdict = 'loss';
    else verdict = 'severe';

    const marginKeys = sideB.totals.keys - sideA.totals.keys;
    const marginScrolls = sideB.totals.scrolls - sideA.totals.scrolls;
    const marginVizard = sideB.totals.vizard - sideA.totals.vizard;

    return res.status(200).json({
      ok: true, ratio, verdict,
      sign: marginKeys >= 0 ? '+' : '',
      margins: { keys: marginKeys, scrolls: marginScrolls, vizard: marginVizard },
      sideA, sideB,
      footer: 'Trade margins calculated mechanically | Zero AI footprint.'
    });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
