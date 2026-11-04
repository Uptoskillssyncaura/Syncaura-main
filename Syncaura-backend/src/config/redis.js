/**
 * Redis client for shared ephemeral storage (OAuth exchange codes, state nonces).
 * Uses redis@6 (node-redis v4 API).
 */
import { createClient } from 'redis';

let redisClient = null;
let redisConnected = false;

const initRedis = async () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn('[Redis] REDIS_URL is not set — Redis is DISABLED. OAuth exchange codes will use in-memory fallback (not safe for multi-instance production).');
    return null;
  }

  const client = createClient({
    url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          console.error('[Redis] Too many reconnect attempts. Giving up.');
          return new Error('Redis reconnect limit exceeded');
        }
        return Math.min(retries * 200, 2000);
      },
      connectTimeout: 10000,
    },
  });

  client.on('error', (err) => {
    console.error('[Redis] Client error:', err.message);
    redisConnected = false;
  });

  client.on('connect', () => {
    console.log('[Redis] Connected successfully.');
    redisConnected = true;
  });

  client.on('reconnecting', () => {
    console.warn('[Redis] Reconnecting...');
    redisConnected = false;
  });

  try {
    await client.connect();
    redisClient = client;
    redisConnected = true;
    return client;
  } catch (err) {
    console.error('[Redis] Failed to connect on startup:', err.message);
    redisClient = null;
    redisConnected = false;
    return null;
  }
};

/**
 * Store an OAuth exchange code in Redis with a TTL (seconds).
 * Key format: oauthcode:<code>
 */
export const setExCode = async (code, payload, ttlSeconds = 60) => {
  if (!redisClient || !redisConnected) {
    throw new Error('Redis is not connected — cannot store OAuth exchange code safely');
  }
  await redisClient.set(`oauthcode:${code}`, JSON.stringify(payload), { EX: ttlSeconds });
};

/**
 * Atomically get AND delete an OAuth exchange code from Redis (single-use).
 * Returns the parsed payload, or null if not found/expired.
 */
export const getAndDelExCode = async (code) => {
  if (!redisClient || !redisConnected) {
    throw new Error('Redis is not connected — cannot retrieve OAuth exchange code');
  }
  // GETDEL is atomic: get + delete in one operation (prevents race conditions / replay)
  const raw = await redisClient.getDel(`oauthcode:${code}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Store an OAuth state nonce in Redis to prevent replay attacks.
 * Key format: oauthnonce:<nonce>
 * Returns false if nonce already exists (replay detected), true if newly stored.
 */
export const setNonceIfAbsent = async (nonce, ttlSeconds = 600) => {
  if (!redisClient || !redisConnected) {
    throw new Error('Redis is not connected — cannot store OAuth nonce');
  }
  // SET NX = only set if Not eXists — atomic anti-replay
  const result = await redisClient.set(`oauthnonce:${nonce}`, '1', { EX: ttlSeconds, NX: true });
  // Returns 'OK' if set (new), null if already existed (replay)
  return result === 'OK';
};

export const isRedisConnected = () => redisConnected;

export { initRedis };
export default redisClient;

