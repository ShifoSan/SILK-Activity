// lib/silkdb.js — Shared Atlas + tie-break engine for Compare (and future Trade).
// NOTE: api/value.js intentionally keeps its own copy; this lib does not touch it.
import pkg from 'mongodb';
const { MongoClient } = pkg;

let client, collection;
export async function getValueCollection() {
  if (collection) return collection;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  collection = client.db('silk_bot').collection('value_list'); // verbatim from bot
  return collection;
}

// --- Faithful port of Python difflib.SequenceMatcher.ratio (same as api/value.js) ---
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
export function closestMatch(word, names) {
  const s = new SequenceMatcher(); s.setSeq2(word);
  let best = null, bestR = -1;
  for (const x of names) { s.setSeq1(x); const r = s.ratio(); if (r > bestR) { bestR = r; best = x; } }
  return best;
}

// --- trade_compare.py parsing helpers, mirrored ---
export function extractQuantityAndName(raw) {
  const clean = String(raw == null ? '' : raw).trim();
  const m = clean.match(/^(\d+)\s*x?\s+(.+)$/i);
  if (m) return { quantity: parseInt(m[1], 10), name: m[2].trim() };
  return { quantity: 1, name: clean };
}
export function parseRawCurrency(name) {
  const m = String(name == null ? '' : name).trim().toLowerCase().match(/^(\d+)\s*keys?$/);
  return m ? parseInt(m[1], 10) : null;
}
export function getNumericValue(field, levelKey = null) {
  if (field === null || field === undefined) return 0;
  if (typeof field === 'object') {
    if (levelKey && levelKey in field) return field[levelKey] || 0;
    return field.Min ?? 0;
  }
  return field;
}
function zeroed(name, error) {
  return { displayName: String(name), keys: 0, scrolls: 0, vizard: 0, gemsTax: 0, goldTax: 0, error };
}

// --- Per-item lookup mirroring fetch_item_data (with tightened, word-boundary level detection) ---
export async function fetchCompareItem(rawQuery) {
  const { quantity, name: itemQuery } = extractQuantityAndName(rawQuery);
  const directKeys = parseRawCurrency(itemQuery);
  if (directKeys !== null) {
    const total = directKeys * quantity;
    return {
      displayName: `Raw Currency (${total.toLocaleString('en-US')} Keys)`,
      keys: total, scrolls: total / 3, vizard: total / 900, gemsTax: 0, goldTax: 0, error: null
    };
  }
  let col;
  try { col = await getValueCollection(); } catch { return zeroed(rawQuery, 'config_missing'); }
  try {
    const lower = itemQuery.toLowerCase();
    const isLvl10 = /\b(10|max|lvl\s*10|level\s*10)\b/i.test(lower); // tightened per decision (was substring)
    const levelKey = isLvl10 ? 'Lvl_10' : 'Lvl_0';
    let searchQuery = itemQuery
      .replace(/\b(lvl|level|lv)\s*(0|10)\b/gi, '')
      .replace(/\bmax\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!searchQuery) searchQuery = itemQuery;

    const cursor = col.aggregate([
      { $search: { index: 'default', text: { query: searchQuery, path: 'Item', fuzzy: { maxEdits: 2, prefixLength: 1 } } } },
      { $limit: 5 }
    ]);
    const results = await cursor.toArray();
    if (!results.length) return zeroed(rawQuery, 'not_found');

    const names = results.map(d => d.Item);
    const best = closestMatch(searchQuery, names) || names[0];
    const data = results.find(d => d.Item === best) || results[0];

    const finalName = data.Item || 'Unknown Item';
    const isPerk = data.Category === 'Perks';
    const lk = isPerk ? levelKey : null;
    const levelLabel = isPerk ? ` (${levelKey.replace('_', ' ')})` : '';
    const baseKeys = getNumericValue(data.Value_Key, lk);
    const baseScrolls = getNumericValue(data.Value_Scroll, lk);
    const baseVizard = getNumericValue(data.Value_Viz, lk);
    const baseGoldTax = getNumericValue(data.Tax_Gold, lk);
    const baseGemsTax = getNumericValue(data.Tax_Gem, lk);
    const decorated = `${finalName}${levelLabel}`;
    const displayName = quantity > 1 ? `${decorated} x${quantity}` : decorated;
    return {
      displayName,
      keys: baseKeys * quantity, scrolls: baseScrolls * quantity, vizard: baseVizard * quantity,
      gemsTax: baseGemsTax * quantity, goldTax: baseGoldTax * quantity, error: null
    };
  } catch {
    return zeroed(rawQuery, 'failed_to_parse');
  }
}
