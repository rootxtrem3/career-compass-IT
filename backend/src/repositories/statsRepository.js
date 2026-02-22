import { query } from '../config/db.js';

export async function getWorldStats() {
  const { rows } = await query(
    `SELECT
      metric_key AS key,
      label,
      value,
      unit,
      source_name AS source,
      source_url,
      snapshot_date,
      sort_order,
      metadata
    FROM world_stats
    ORDER BY sort_order ASC, metric_key ASC`
  );
  return rows;
}
