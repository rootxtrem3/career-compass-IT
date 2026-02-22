CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  file_name TEXT PRIMARY KEY,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS riasec_codes (
  code CHAR(1) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mbti_types (
  code VARCHAR(4) PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  median_salary_usd INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT careers_experience_level_check
    CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead'))
);

CREATE TABLE IF NOT EXISTS career_riasec (
  career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  riasec_code CHAR(1) NOT NULL REFERENCES riasec_codes(code) ON DELETE RESTRICT,
  weight NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  PRIMARY KEY (career_id, riasec_code),
  CONSTRAINT career_riasec_weight_check CHECK (weight >= 0 AND weight <= 1)
);

CREATE TABLE IF NOT EXISTS career_mbti (
  career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  mbti_code VARCHAR(4) NOT NULL REFERENCES mbti_types(code) ON DELETE RESTRICT,
  weight NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  PRIMARY KEY (career_id, mbti_code),
  CONSTRAINT career_mbti_weight_check CHECK (weight >= 0 AND weight <= 1)
);

CREATE TABLE IF NOT EXISTS career_skill_requirements (
  career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  importance NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  min_level TEXT NOT NULL DEFAULT 'working',
  PRIMARY KEY (career_id, skill_id),
  CONSTRAINT skill_importance_check CHECK (importance >= 0 AND importance <= 1),
  CONSTRAINT skill_min_level_check CHECK (min_level IN ('basic', 'working', 'advanced', 'expert'))
);

CREATE TABLE IF NOT EXISTS career_certification_requirements (
  career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  certification_id INTEGER NOT NULL REFERENCES certifications(id) ON DELETE RESTRICT,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  PRIMARY KEY (career_id, certification_id)
);

CREATE TABLE IF NOT EXISTS job_sources (
  id SERIAL PRIMARY KEY,
  source_key TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES job_sources(id) ON DELETE RESTRICT,
  external_id TEXT NOT NULL,
  career_id INTEGER REFERENCES careers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  remote_type TEXT,
  employment_type TEXT,
  salary_min NUMERIC(12,2),
  salary_max NUMERIC(12,2),
  salary_currency VARCHAR(8),
  apply_url TEXT NOT NULL,
  source_url TEXT,
  description TEXT,
  posted_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (source_id, external_id)
);

CREATE TABLE IF NOT EXISTS world_stats (
  id SERIAL PRIMARY KEY,
  metric_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  snapshot_date DATE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS analysis_runs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  input_payload JSONB NOT NULL,
  output_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_career_id ON jobs(career_id);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_fetched_at ON jobs(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_career_skill_requirements_career_id ON career_skill_requirements(career_id);
CREATE INDEX IF NOT EXISTS idx_career_riasec_career_id ON career_riasec(career_id);
CREATE INDEX IF NOT EXISTS idx_career_mbti_career_id ON career_mbti(career_id);
CREATE INDEX IF NOT EXISTS idx_world_stats_sort_order ON world_stats(sort_order);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS careers_set_updated_at ON careers;
CREATE TRIGGER careers_set_updated_at
BEFORE UPDATE ON careers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
