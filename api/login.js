// api/login.js — POST { username, password } -> { token, user }
import crypto from 'crypto';
import { getAccountsCollection, hashPassword, createSession } from '../lib/sessions.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const username = req.body && req.body.username ? String(req.body.username).trim() : '';
  const password = req.body && req.body.password ? String(req.body.password) : '';
  if (!username || !password) return res.status(400).json({ error: 'missing_fields' });
  try {
    const col = await getAccountsCollection();
    const acct = await col.findOne({ usernameLower: username.toLowerCase() });
    if (!acct) return res.status(401).json({ error: 'no_account' });
    const a = Buffer.from(hashPassword(password, acct.salt), 'hex');
    const b = Buffer.from(String(acct.hash), 'hex');
    const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!ok) return res.status(401).json({ error: 'bad_password' });
    const user = { id: acct.userId, username: acct.username, globalName: acct.globalName || null, avatar: acct.avatar || null };
    const { token } = await createSession(user);
    return res.status(200).json({ token, user });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
