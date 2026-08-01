// api/value.js — Zero-AI Atlas text+fuzzy lookup, ported 1:1 from aotr_value.py
import pkg from 'mongodb';
const { MongoClient } = pkg;

let client, collection;
async function getCollection() {
  if (collection) return collection;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  collection = client.db('silk_bot').collection('value_list'); // verbatim from bot
  return collection;
}

// --- Structural formatting helpers (mirror bot's format_val / get_lvl) ---
function formatVal(val, isFloat = false) {
  if (val === null || val === undefined) return 'N/A / O/C';
  if (typeof val === 'object' && 'Min' in val && 'Max' in val) {
    return `${Number(val.Min).toLocaleString('en-US')} - ${Number(val.Max).toLocaleString('en-US')}`;
  }
  if (isFloat) {
    // mirror: f"{float(val):,.3f}".rstrip('0').rstrip('.')
    let s = Number(val).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    return s.replace(/0+$/, '').replace(/\.$/, '');
  }
  return Math.trunc(Number(val)).toLocaleString('en-US');
}
const getLvl = (field, key) => (field && typeof field === 'object' ? field[key] : undefined);

// --- Faithful port of Python difflib.SequenceMatcher.ratio (autojunk off; short strings) ---
class SequenceMatcher {
  constructor() { this.a = ''; this.b = ''; this.b2j = new Map(); this.blocks = null; }
  setSeq2(b) {
    this.b = b; this.b2j = new Map(); this.blocks = null;
    for (let i = 0; i < b.length; i++) {
      const ch = b[i];
      if (!this.b2j.has(ch)) this.b2j.set(ch, []);
      this.b2j.get(ch).push(i);
    }
  }
  setSeq1(a) { this.a = a; this.blocks = null; }
  _longest(alo, ahi, blo, bhi) {
    const a = this.a, b = this.b, b2j = this.b2j;
    let besti = alo, bestj = blo, bestsize = 0, j2len = new Map();
    for (let i = alo; i < ahi; i++) {
      const newj2len = new Map();
      const list = b2j.get(a[i]);
      if (list) for (const j of list) {
        if (j < blo) continue; if (j >= bhi) break;
        const k = (j2len.get(j - 1) || 0) + 1;
        newj2len.set(j, k);
        if (k > bestsize) { besti = i - k + 1; bestj = j - k + 1; bestsize = k; }
      }
      j2len = newj2len;
    }
    return [besti, bestj, bestsize];
  }
  getMatchingBlocks() {
    if (this.blocks) return this.blocks;
    const la = this.a.length, lb = this.b.length;
    const queue = [[0, la, 0, lb]], raw = [];
    while (queue.length) {
      const [alo, ahi, blo, bhi] = queue.pop();
      const [i, j, k] = this._longest(alo, ahi, blo, bhi);
      if (k) {
        raw.push([i, j, k]);
        if (alo < i && blo < j) queue.push([alo, i, blo, j]);
        if (i + k < ahi && j + k < bhi) queue.push([i + k, ahi, j + k, bhi]);
      }
    }
    raw.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    let i1 = 0, j1 = 0, k1 = 0; const chained = [];
    for (const [i2, j2, k2] of raw) {
      if (i1 + k1 === i2 && j1 + k1 === j2) k1 += k2;
      else { if (k1) chained.push([i1, j1, k1]); i1 = i2; j1 = j2; k1 = k2; }
    }
    if (k1) chained.push([i1, j1, k1]);
    chained.push([la, lb, 0]);
    return (this.blocks = chained);
  }
  ratio() {
    const matches = this.getMatchingBlocks().reduce((s, m) => s + m[2], 0);
    const t = this.a.length + this.b.length;
    return t ? (2.0 * matches) / t : 1.0;
  }
}
// mirror difflib.get_close_matches(word, possibilities, n=1, cutoff=0.0)
function closestMatch(word, names) {
  const s = new SequenceMatcher(); s.setSeq2(word);
  let best = null, bestR = -1;
  for (const x of names) { s.setSeq1(x); const r = s.ratio(); if (r > bestR) { bestR = r; best = x; } }
  return best;
}

function classifyRate(rate) {
  const r = String(rate == null ? '' : rate).toLowerCase();
  if (/rise|rising|hyped/.test(r)) return 'rise';
  if (/drop|dropping|low/.test(r)) return 'drop';
  return 'stable';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const query = (req.body && req.body.query ? String(req.body.query) : '').trim();
  if (!query) return res.status(400).json({ error: 'Empty query' });

  try {
    const col = await getCollection();
    const cursor = col.aggregate([
      { $search: { index: 'default', text: { query, path: 'Item', fuzzy: { maxEdits: 2, prefixLength: 1 } } } }, // verbatim
      { $limit: 5 }
    ]);
    const results = await cursor.toArray();
    if (!results.length) return res.status(200).json({ found: false, query });

    const names = results.map(d => d.Item);
    const winner = closestMatch(query, names) || names[0];
    const data = results.find(d => d.Item === winner) || results[0];

    const name = data.Item || 'Unknown Item';
    const rarity = data.Rarity || 'Unknown';
    const rate = data['Rate Of Change'] ?? 'Unknown';
    const isPerk = data.Category === 'Perks';
    const d = data.Demand;
    const demandText = (d === null || d === undefined || d === '') ? 'N/A' : `${d}/10`;

    let perk = null, standard = null;
    if (isPerk) {
      const tier = (k) => ({
        keys: formatVal(getLvl(data.Value_Key, k)),
        scrolls: formatVal(getLvl(data.Value_Scroll, k), true),
        masks: formatVal(getLvl(data.Value_Viz, k), true),
        gold: formatVal(getLvl(data.Tax_Gold, k))
      });
      perk = { lvl0: tier('Lvl_0'), lvl10: tier('Lvl_10') };
    } else {
      const tax = [];
      if (data.Tax_Gem !== null && data.Tax_Gem !== undefined) tax.push({ kind: 'gem', value: formatVal(data.Tax_Gem) });
      if (data.Tax_Gold !== null && data.Tax_Gold !== undefined) tax.push({ kind: 'gold', value: formatVal(data.Tax_Gold) });
      if (!tax.length) tax.push({ kind: 'none' });
      standard = {
        base: { keys: formatVal(data.Value_Key), scrolls: formatVal(data.Value_Scroll, true), masks: formatVal(data.Value_Viz, true) },
        tax
      };
    }

    return res.status(200).json({
      found: true, name, rarity, category: data.Category || null, isPerk,
      image_link: data.image_link || null,
      market: { rarity, demandText, rate: String(rate), rateKind: classifyRate(rate) },
      perk, standard,
      footer: 'The official AoTR values | Mechanically Verified'
    });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
