import { query } from '../config/db.js';

export async function findUserByEmail(email) {
  const { rows } = await query(
    'SELECT id, full_name, email, password_hash, role, is_active, created_at FROM users WHERE email = $1 LIMIT 1',
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

export async function createUser({ fullName, email, passwordHash }) {
  const { rows } = await query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, role, is_active, created_at`,
    [fullName, email.toLowerCase(), passwordHash]
  );
  return rows[0];
}
