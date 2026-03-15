CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  mbti_type VARCHAR(4),
  riasec_code VARCHAR(3),
  career_goal_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  description TEXT
);

CREATE TABLE user_skills (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  riasec_code VARCHAR(3),
  salary_min INTEGER,
  salary_max INTEGER,
  demand_level TEXT,
  growth_rate NUMERIC(5,2),
  education_requirements TEXT
);

CREATE TABLE career_mbti (
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  mbti_type VARCHAR(4) NOT NULL,
  weight NUMERIC(4,3) NOT NULL DEFAULT 0.5,
  PRIMARY KEY (career_id, mbti_type)
);

CREATE TABLE career_skills (
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  importance_weight NUMERIC(4,3) NOT NULL DEFAULT 0.5,
  PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE saved_careers (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  saved_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, career_id)
);

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mbti_result VARCHAR(4),
  riasec_result VARCHAR(3),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE career_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  readiness_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE career_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE user_milestones (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES career_milestones(id) ON DELETE CASCADE,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, milestone_id)
);

CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  meta JSONB
);

CREATE TABLE recommendation_items (
  recommendation_id UUID REFERENCES recommendations(id) ON DELETE CASCADE,
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  breakdown JSONB,
  PRIMARY KEY (recommendation_id, career_id)
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  posted_at TIMESTAMP,
  apply_url TEXT,
  raw JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (source, external_id)
);
