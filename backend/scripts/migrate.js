import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../migrations');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      file_name TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getExecutedMigrations() {
  const { rows } = await pool.query('SELECT file_name FROM schema_migrations');
  return new Set(rows.map((row) => row.file_name));
}

async function run() {
  await ensureMigrationsTable();

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const executed = await getExecutedMigrations();

  for (const file of files) {
    if (executed.has(file)) {
      console.log(`Skipping ${file} (already executed)`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (file_name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Executed migration: ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  await pool.end();
  console.log('Migration run complete.');
}

run().catch(async (error) => {
  console.error('Migration failed:', error);
  await pool.end();
  process.exit(1);
});
