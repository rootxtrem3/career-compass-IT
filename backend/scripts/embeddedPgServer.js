import path from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.EMBEDDED_PG_PORT || 55432);
const USER = process.env.EMBEDDED_PG_USER || 'postgres';
const PASSWORD = process.env.EMBEDDED_PG_PASSWORD || 'postgres';
const DB_NAME = process.env.EMBEDDED_PG_DB || 'career_compass';
const SHOULD_RESET = ['1', 'true', 'yes'].includes(
  String(process.env.EMBEDDED_PG_RESET || '').toLowerCase()
);

const databaseDir = path.resolve(__dirname, '../.embedded-pg');
const pgVersionPath = path.join(databaseDir, 'PG_VERSION');

const pg = new EmbeddedPostgres({
  databaseDir,
  user: USER,
  password: PASSWORD,
  port: PORT,
  persistent: true,
  onLog: (message) => {
    if (String(message).trim()) console.log(String(message).trim());
  },
  onError: (message) => {
    if (String(message).trim()) console.error(String(message).trim());
  }
});

async function initialiseCluster() {
  if (SHOULD_RESET && fs.existsSync(databaseDir)) {
    console.log(`Resetting embedded PostgreSQL data directory: ${databaseDir}`);
    await fsPromises.rm(databaseDir, { recursive: true, force: true });
  }

  if (fs.existsSync(pgVersionPath)) {
    return;
  }

  try {
    await pg.initialise();
  } catch (error) {
    const message = String(error?.message || error);
    const looksLikeStaleDirError =
      message.includes('data directory might already exist') || message.includes('already exist');

    if (looksLikeStaleDirError && !fs.existsSync(pgVersionPath)) {
      console.warn('Detected stale embedded PostgreSQL directory. Recreating data directory...');
      await fsPromises.rm(databaseDir, { recursive: true, force: true });
      await pg.initialise();
      return;
    }

    throw error;
  }
}

async function start() {
  await initialiseCluster();
  await pg.start();

  try {
    await pg.createDatabase(DB_NAME);
  } catch {
    // already exists
  }

  console.log(
    `Embedded PostgreSQL running on postgres://${USER}:${PASSWORD}@127.0.0.1:${PORT}/${DB_NAME}`
  );
}

async function stop(signal) {
  try {
    console.log(`Stopping embedded PostgreSQL (${signal})...`);
    await pg.stop();
    process.exit(0);
  } catch (error) {
    console.error('Failed to stop embedded PostgreSQL:', error);
    process.exit(1);
  }
}

start().catch((error) => {
  console.error('Failed to start embedded PostgreSQL:', error);
  process.exit(1);
});

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
