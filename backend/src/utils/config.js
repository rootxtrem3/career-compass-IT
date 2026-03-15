import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const numberFromEnv = (fallback) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const parsed = Number(String(value).trim());
    return Number.isNaN(parsed) ? undefined : parsed;
  }, z.number().default(fallback));

const baseSchema = z.object({
  PORT: numberFromEnv(4000),
  DATABASE_URL: z.string().min(1),
  AUTH_BYPASS: z.coerce.boolean().default(false),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  ADZUNA_APP_ID: z.string().min(1),
  ADZUNA_APP_KEY: z.string().min(1),
  ADZUNA_COUNTRY: z.string().default("us"),
  ADZUNA_QUERY: z.string().optional(),
  CACHE_TTL_SECONDS: numberFromEnv(3600)
});

const baseConfig = baseSchema.parse(process.env);

if (!baseConfig.AUTH_BYPASS) {
  if (!baseConfig.FIREBASE_PROJECT_ID || !baseConfig.FIREBASE_CLIENT_EMAIL || !baseConfig.FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase Admin credentials are required unless AUTH_BYPASS=true.");
  }
} else {
  baseConfig.FIREBASE_PROJECT_ID ??= "dev-project";
  baseConfig.FIREBASE_CLIENT_EMAIL ??= "dev@example.com";
  baseConfig.FIREBASE_PRIVATE_KEY ??= "dev";
}

export const config = baseConfig;
