/**
 * Redis client for shared ephemeral storage (OAuth exchange codes, state nonces).
 * Uses redis@6 (node-redis v4 API).
 * Designed with graceful fallbacks so Redis outages never crash the server.
 */
import { createClient } from 'redis';

let redisClient = null;
let redisConnected = false;

export const initRedis = async () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn('[Redis] REDIS_URL is not set — Redis is DISABLED. Ephemeral storage will fall back to PostgreSQL database.');
    return null;
  }

  try {
    const client = createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('[Redis] Reconnect retry limit reached. Giving up.');
            return new Error('Redis reconnect limit exceeded');
          }
          return Math.min(retries * 500, 3000);
        },
        connectTimeout: 10000,
      },
    });

    client.on('error', (err) => {
      console.warn('[Redis] Client notice/error:', err.message);
      redisConnected = false;
    });

    client.on('connect', () => {
      console.log('✅ [Redis] Connected successfully.');
      redisConnected = true;
    });

    client.on('ready', () => {
      redisConnected = true;
    });

    client.on('reconnecting', () => {
      console.warn('[Redis] Reconnecting...');
      redisConnected = false;
    });

    client.on('end', () => {
      redisConnected = false;
    });

    await client.connect();
    redisClient = client;
    redisConnected = true;
    return client;
  } catch (err) {
    console.warn('[Redis] Initial connection failed:', err.message, '— will use PostgreSQL persistence.');
    redisClient = null;
    redisConnected = false;
    return null;
  }
};

/**
 * Store an OAuth exchange code in Redis with TTL (seconds).
 * Key format: oauthcode:<code>
 */
export const setExCode = async (code, payload, ttlSeconds = 300) => {
  if (!redisClient || !redisConnected) return false;
  try {
    await redisClient.set(`oauthcode:${code}`, JSON.stringify(payload), { EX: ttlSeconds });
    return true;
  } catch (err) {
    console.warn('[Redis] setExCode error:', err.message);
    return false;
  }
};

/**
 * Atomically get AND delete an OAuth exchange code from Redis (single-use).
 * Returns the parsed payload, or null if not found/expired/disconnected.
 */
export const getAndDelExCode = async (code) => {
  if (!redisClient || !redisConnected) return null;
  try {
    const raw = await redisClient.getDel(`oauthcode:${code}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Redis] getAndDelExCode error:', err.message);
    return null;
  }
};

/**
 * Store an OAuth state nonce in Redis to prevent replay attacks.
 * Key format: oauthnonce:<nonce>
 * Returns false if nonce already exists (replay detected), true if newly stored.
 */
export const setNonceIfAbsent = async (nonce, ttlSeconds = 600) => {
  if (!redisClient || !redisConnected) return null; // indicates Redis not available, fall back to DB
  try {
    const result = await redisClient.set(`oauthnonce:${nonce}`, '1', { EX: ttlSeconds, NX: true });
    return result === 'OK';
  } catch (err) {
    console.warn('[Redis] setNonceIfAbsent error:', err.message);
    return null;
  }
};

export const isRedisConnected = () => redisConnected;

export default redisClient;
