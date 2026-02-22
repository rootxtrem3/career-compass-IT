import crypto from 'node:crypto';
import { env } from '../config/env.js';

function encode(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function createMockToken(payload) {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const body = encode(payload);
  const signature = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyMockToken(token) {
  if (!token) return null;
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) return null;

  const expected = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (expected !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload;
  } catch {
    return null;
  }
}
