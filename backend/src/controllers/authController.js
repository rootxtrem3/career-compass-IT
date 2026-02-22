import { z } from 'zod';
import { login, register } from '../services/authService.js';
import { HttpError } from '../utils/httpError.js';

const registerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export async function registerUser(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid registration payload', parsed.error.flatten());
  }

  const result = await register(parsed.data);
  res.status(201).json({ success: true, data: result });
}

export async function loginUser(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid login payload', parsed.error.flatten());
  }

  const result = await login(parsed.data);
  res.json({ success: true, data: result });
}

export async function getCurrentUser(req, res) {
  if (!req.user?.sub) {
    throw new HttpError(401, 'Unauthorized');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: req.user.sub,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
}
