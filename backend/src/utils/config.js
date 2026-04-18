import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const numberFromEnv = (fallback) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const parsed = Number(String(value).trim());
    return Number.isNaN(parsed) ? undefined : parsed;
  }, z.number().default(fallback));

const booleanFromEnv = (fallback) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    if (typeof value === "boolean") {
      return value;
    }
    const normalized = String(value).trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
    return fallback;
  }, z.boolean().default(fallback));

const baseSchema = z.object({
  PORT: numberFromEnv(4000),
  DATABASE_URL: z.string().optional(),
  AUTH_BYPASS: booleanFromEnv(true),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  ADZUNA_APP_ID: z.string().optional(),
  ADZUNA_APP_KEY: z.string().optional(),
  ADZUNA_COUNTRY: z.string().default("us"),
  ADZUNA_QUERY: z.string().optional(),
  CACHE_TTL_SECONDS: numberFromEnv(3600)
});

const baseConfig = baseSchema.parse(process.env);

if (!baseConfig.AUTH_BYPASS) {
  if (!baseConfig.FIREBASE_PROJECT_ID || !baseConfig.FIREBASE_CLIENT_EMAIL || !baseConfig.FIREBASE_PRIVATE_KEY) {
    console.warn("Firebase Admin credentials are missing. Falling back to dummy credentials.");
    baseConfig.FIREBASE_PROJECT_ID ||= "dev-project";
    baseConfig.FIREBASE_CLIENT_EMAIL ||= "dev@example.com";
    baseConfig.FIREBASE_PRIVATE_KEY ||= "dev";
  }
} else {
  baseConfig.FIREBASE_PROJECT_ID ??= "dev-project";
  baseConfig.FIREBASE_CLIENT_EMAIL ??= "dev@example.com";
  baseConfig.FIREBASE_PRIVATE_KEY ??= "dev";
}

export const config = baseConfig;
