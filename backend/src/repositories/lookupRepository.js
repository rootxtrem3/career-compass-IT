import { query } from '../config/db.js';

export async function getRiasecOptions() {
  const { rows } = await query(
    'SELECT code, name, description FROM riasec_codes ORDER BY code ASC'
  );
  return rows;
}

export async function getMbtiOptions() {
  const { rows } = await query('SELECT code, title FROM mbti_types ORDER BY code ASC');
  return rows;
}

export async function getSkills() {
  const { rows } = await query(
    'SELECT id, name, category FROM skills ORDER BY category ASC, name ASC'
  );
  return rows;
}
