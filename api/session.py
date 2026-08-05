// lib/sessions.js — PBKDF2 hashing (identical params to cogs/activity_password.py) + 7-day sessions.
import pkg from 'mongodb';
import crypto from 'crypto';
const { MongoClient } = pkg;

const ITERATIONS = 100000;
const KEY_LEN = 32;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

let client, accounts, sessions;
async function ensure() {
  if (client) return client;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  return client;
}
export async function getAccountsCollection() {
  if (accounts) return accounts;
  const c = await ensure();
  accounts = c.db('silk_bot').collection('activity_accounts');
  return accounts;
}
export async function getSessionsCollection() {
  if (sessions) return sessions;
  const c = await ensure();
  sessions = c.db('silk_bot').collection('activity_sessions');
  return sessions;
}
export function hashPassword(password, saltHex) {
  return crypto.pbkdf2Sync(String(password), Buffer.from(saltHex, 'hex'), ITERATIONS, KEY_LEN, 'sha256').toString('hex');
}
export async function createSession(user) {
  const col = await getSessionsCollection();
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + SESSION_MS;
  await col.insertOne({ token, userId: user.id, username: user.username, globalName: user.globalName || null, avatar: user.avatar || null, expiresAt });
  return { token, expiresAt };
}
export async function verifySession(token) {
  if (!token) return null;
  const col = await getSessionsCollection();
  return col.findOne({ token, expiresAt: { $gt: Date.now() } });
}
