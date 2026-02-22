import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(`Career Compass API listening on http://localhost:${env.PORT}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
