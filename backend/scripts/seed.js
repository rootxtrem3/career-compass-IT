import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedsDir = path.resolve(__dirname, '../seeds');

async function run() {
  const files = (await fs.readdir(seedsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(seedsDir, file), 'utf8');
    await pool.query(sql);
    console.log(`Executed seed: ${file}`);
  }

  await pool.end();
  console.log('Seeding complete.');
}

run().catch(async (error) => {
  console.error('Seed failed:', error);
  await pool.end();
  process.exit(1);
});
