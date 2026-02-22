import crypto from 'node:crypto';
import { createUser, findUserByEmail } from '../repositories/authRepository.js';
import { HttpError } from '../utils/httpError.js';
import { createMockToken } from '../utils/jwtMock.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function toUserResponse(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at
  };
}

export async function register({ fullName, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  const passwordHash = hashPassword(password);
  const user = await createUser({ fullName, email, passwordHash });

  const token = createMockToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    type: 'access'
  });

  return { token, user: toUserResponse(user) };
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const hashed = hashPassword(password);
  if (hashed !== user.password_hash) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = createMockToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    type: 'access'
  });

  return { token, user: toUserResponse(user) };
}
