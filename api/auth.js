// api/auth.js — POST { code } -> { token, user }
import { exchangeCode, fetchSelf } from '../lib/discordAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const code = req.body && req.body.code ? String(req.body.code) : '';
  if (!code) return res.status(400).json({ error: 'missing_code' });
  try {
    const tok = await exchangeCode(code);
    const me = await fetchSelf(tok.access_token);
    if (!me) return res.status(502).json({ error: 'discord_user_fetch_failed' });
    return res.status(200).json({
      token: tok.access_token,
      user: { id: me.id, username: me.username, globalName: me.global_name || null, avatar: me.avatar || null }
    });
  } catch (e) {
    return res.status(502).json({ error: 'auth_failed', detail: String(e && e.message ? e.message : e) });
  }
}
