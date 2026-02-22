import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JOBS_SYNC_LIMIT: z.coerce.number().int().positive().max(200).default(40),
  JOBS_PROVIDER: z.enum(['remotive', 'custom', 'adzuna']).default('remotive'),
  CUSTOM_JOBS_API_URL: z.string().optional(),
  CUSTOM_JOBS_API_METHOD: z.enum(['GET', 'POST']).default('GET'),
  CUSTOM_JOBS_API_HEADERS_JSON: z.string().default('{}'),
  CUSTOM_JOBS_RESULTS_PATH: z.string().default('jobs'),
  CUSTOM_JOBS_SEARCH_PARAM: z.string().default('search'),
  CUSTOM_JOBS_LIMIT_PARAM: z.string().default('limit'),
  ADZUNA_APP_ID: z.string().optional(),
  ADZUNA_API_KEY: z.string().optional(),
  ADZUNA_COUNTRY: z.string().default('us'),
  ADZUNA_PAGE: z.coerce.number().int().positive().default(1),
  JWT_SECRET: z.string().min(12, 'JWT_SECRET must be at least 12 characters'),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = parsed.data;
