import mongoose from 'mongoose';
import dns from 'node:dns';

// Configure DNS servers fallback to prevent Windows Node.js querySrv ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if restricted
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const safeCache = cached;

export async function connectToDatabase() {
  if (safeCache.conn) {
    return safeCache.conn;
  }

  if (!safeCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    safeCache.promise = mongoose.connect(MONGODB_URI!, opts).then((instance) => {
      return instance;
    });
  }

  try {
    safeCache.conn = await safeCache.promise;
  } catch (e) {
    safeCache.promise = null;
    throw e;
  }

  return safeCache.conn;
}
