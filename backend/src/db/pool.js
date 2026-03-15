import pg from "pg";
import { config } from "../utils/config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10
});

export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}
