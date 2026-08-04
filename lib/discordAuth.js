// lib/discordAuth.js — Discord OAuth2 code exchange + bearer verification with short cache.
const DISCORD_API = 'https://discord.com/api/v10';

export async function exchangeCode(code) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code
  });
  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!res.ok) throw new Error(`token_exchange_${res.status}`);
  return res.json(); // { access_token, ... }
}

export async function fetchSelf(token) {
  const res = await fetch(`${DISCORD_API}/users/@me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  return res.json(); // { id, username, global_name, avatar }
}

const cache = new Map();
export async function verifyBearer(token) {
  if (!token) return null;
  const hit = cache.get(token);
  if (hit && hit.exp > Date.now()) return hit.user;
  const user = await fetchSelf(token);
  if (user) {
    cache.set(token, { user, exp: Date.now() + 5 * 60 * 1000 });
    if (cache.size > 500) cache.clear();
  }
  return user;
}
