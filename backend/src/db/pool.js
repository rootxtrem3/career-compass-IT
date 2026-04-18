import pg from "pg";
import { config } from "../utils/config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10
});

export async function query(text, params = []) {
  if (!config.DATABASE_URL) {
    console.warn("Database not configured in db/pool.js. Returning empty result.");
    return [];
  }
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error in db/pool.js:", error.message);
    return [];
  }
}
