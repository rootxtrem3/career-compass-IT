import { env } from '../src/config/env.js';
import { pool } from '../src/config/db.js';
import { syncJobsFromRemotive } from '../src/services/jobsSyncService.js';

async function run() {
  const result = await syncJobsFromRemotive({ limit: env.JOBS_SYNC_LIMIT });
  console.log('Jobs sync result:', result);
  await pool.end();
}

run().catch(async (error) => {
  console.error('Jobs sync failed:', error);
  await pool.end();
  process.exit(1);
});
