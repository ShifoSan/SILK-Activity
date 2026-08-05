// api/trade.js — Trade Bulletin Board. Session-token auth (bot-issued passwords).
import { getTradeCollection, fetchCompareItem } from '../lib/silkdb.js';
import { verifySession } from '../lib/sessions.js';

const HOURS_ALLOWED = new Set([1, 3, 6, 12, 24, 48, 72]);
const MAX_ACTIVE = 5;
const PAGE = 12;
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function computeTotals(raw, cacheMap) {
  const parts = String(raw || '').split('+').map(s => s.trim()).filter(Boolean).slice(0, 12);
  let total = 0, anyOk = false;
  for (const p of parts) {
    let r = cacheMap.get(p);
    if (!r) { r = await fetchCompareItem(p); cacheMap.set(p, r); }
    total += r.keys || 0;
    if (!r.error) anyOk = true;
  }
  return { total, anyOk };
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return await handleGet(req, res);
    if (req.method === 'POST') return await handleCreate(req, res);
    if (req.method === 'PATCH') return await handlePatch(req, res);
    if (req.method === 'DELETE') return await handleDelete(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}

async function handleGet(req, res) {
  const q = req.query || {};
  const now = Date.now();
  const col = await getTradeCollection();
  const cacheMap = new Map();
  let filter, sort, limit;

  if (q.seller) {
    filter = { sellerId: String(q.seller) };
    sort = { createdAt: -1 };
    limit = 10;
  } else {
    filter = { status: 'open', deadlineTs: { $gt: now } };
    if (q.q) {
      const rx = new RegExp(escRe(String(q.q).trim()), 'i');
      filter.$or = [{ offeringRaw: rx }, { seekingRaw: rx }];
    }
    sort = q.sort === 'soon' ? { deadlineTs: 1 } : { createdAt: -1 };
    limit = PAGE;
  }

  const docs = await col.find(filter).sort(sort).limit(limit).toArray();
  const ads = [];
  for (const d of docs) {
    const off = await computeTotals(d.offeringRaw, cacheMap);
    const seek = await computeTotals(d.seekingRaw, cacheMap);
    ads.push({
      id: String(d._id),
      sellerId: d.sellerId, sellerName: d.sellerName, sellerUsername: d.sellerUsername || d.sellerName, sellerAvatar: d.sellerAvatar || null,
      offeringRaw: d.offeringRaw,
      offeringChips: String(d.offeringRaw).split('+').map(s => s.trim()).filter(Boolean),
      offeringKeys: off.anyOk ? off.total : null,
      seekingRaw: d.seekingRaw,
      seekingKeys: seek.anyOk ? seek.total : null,
      note: d.note || '',
      createdAt: d.createdAt, deadlineTs: d.deadlineTs, status: d.status,
      expired: d.deadlineTs <= now
    });
  }
  const openCount = await col.countDocuments({ status: 'open', deadlineTs: { $gt: now } });
  const out = { ads, openCount };
  if (q.seller) out.myCount = await col.countDocuments({ sellerId: String(q.seller), status: 'open', deadlineTs: { $gt: now } });
  return res.status(200).json(out);
}

async function handleCreate(req, res) {
  const session = await verifySession((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  if (!session) return res.status(401).json({ error: 'unauthorized' });

  const b = req.body || {};
  const offeringRaw = String(b.offering || '').trim();
  const seekingRaw = String(b.seeking || '').trim();
  const note = String(b.note || '').trim().slice(0, 140);
  const hours = Number(b.hours);
  if (!offeringRaw || offeringRaw.length > 300) return res.status(422).json({ error: 'Offering must be 1–300 characters.' });
  if (!seekingRaw || seekingRaw.length > 300) return res.status(422).json({ error: 'Seeking must be 1–300 characters.' });
  if (!HOURS_ALLOWED.has(hours)) return res.status(422).json({ error: 'Invalid deadline.' });

  const col = await getTradeCollection();
  const now = Date.now();
  const check = await computeTotals(offeringRaw, new Map());
  if (!check.anyOk) return res.status(422).json({ error: 'Offering must contain at least one recognizable item.' });

  const active = await col.countDocuments({ sellerId: session.userId, status: 'open', deadlineTs: { $gt: now } });
  if (active >= MAX_ACTIVE) return res.status(422).json({ error: `Active ad limit reached (${MAX_ACTIVE}). Close one or let it expire.` });

  const doc = {
    sellerId: session.userId,
    sellerName: session.globalName || session.username,
    sellerUsername: session.username,
    sellerAvatar: session.avatar || null,
    offeringRaw, seekingRaw, note,
    createdAt: now,
    deadlineTs: now + hours * 3600 * 1000,
    status: 'open'
  };
  const ins = await col.insertOne(doc);
  return res.status(201).json({ id: String(ins.insertedId) });
}

async function handlePatch(req, res) {
  const session = await verifySession((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  if (!session) return res.status(401).json({ error: 'unauthorized' });
  const { id, action } = req.body || {};
  if (!id || !['close', 'reopen'].includes(action)) return res.status(400).json({ error: 'bad_request' });
  const col = await getTradeCollection();
  const { ObjectId } = (await import('mongodb'));
  let oid; try { oid = new ObjectId(String(id)); } catch { return res.status(400).json({ error: 'bad_id' }); }
  const ad = await col.findOne({ _id: oid });
  if (!ad) return res.status(404).json({ error: 'not_found' });
  if (ad.sellerId !== session.userId) return res.status(403).json({ error: 'not_yours' });
  if (action === 'close') await col.updateOne({ _id: oid }, { $set: { status: 'closed' } });
  if (action === 'reopen') {
    if (ad.deadlineTs <= Date.now()) return res.status(422).json({ error: 'Expired ads cannot be reopened — post a fresh one.' });
    await col.updateOne({ _id: oid }, { $set: { status: 'open' } });
  }
  return res.status(200).json({ ok: true });
}

async function handleDelete(req, res) {
  const session = await verifySession((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  if (!session) return res.status(401).json({ error: 'unauthorized' });
  const id = req.query && req.query.id ? String(req.query.id) : '';
  const col = await getTradeCollection();
  const { ObjectId } = (await import('mongodb'));
  let oid; try { oid = new ObjectId(id); } catch { return res.status(400).json({ error: 'bad_id' }); }
  const del = await col.deleteOne({ _id: oid, sellerId: session.userId });
  if (!del.deletedCount) return res.status(403).json({ error: 'not_yours' });
  return res.status(200).json({ ok: true });
}
