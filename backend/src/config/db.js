import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function query(text, params = []) {
  if (!env.DATABASE_URL) {
    console.warn('Database not configured. Returning empty result.');
    return { rows: [], rowCount: 0 };
  }
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Database query error:', error.message);
    return { rows: [], rowCount: 0 };
  }
}

export async function withTransaction(handler) {
  if (!env.DATABASE_URL) {
    console.warn('Database not configured. withTransaction skipped.');
    return null;
  }
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const result = await handler(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Database transaction error:', error.message);
    return null;
  } finally {
    if (client) client.release();
  }
}
