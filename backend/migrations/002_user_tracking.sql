CREATE TABLE IF NOT EXISTS user_analysis_history (
  id BIGSERIAL PRIMARY KEY,
  firebase_uid TEXT NOT NULL,
  mbti_code VARCHAR(4) NOT NULL,
  riasec_codes TEXT[] NOT NULL,
  selected_skill_ids INT[] NOT NULL,
  top_career_ids INT[] NOT NULL,
  top_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_analysis_history_uid_created
  ON user_analysis_history(firebase_uid, created_at DESC);

CREATE TABLE IF NOT EXISTS user_path_checklist_items (
  id BIGSERIAL PRIMARY KEY,
  firebase_uid TEXT NOT NULL,
  career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_ref_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_path_checklist_items_type_check CHECK (item_type IN ('skill', 'certification')),
  CONSTRAINT user_path_checklist_items_unique UNIQUE (firebase_uid, career_id, item_type, item_ref_id)
);

CREATE INDEX IF NOT EXISTS idx_user_path_checklist_uid_career
  ON user_path_checklist_items(firebase_uid, career_id);

DROP TRIGGER IF EXISTS user_path_checklist_items_set_updated_at ON user_path_checklist_items;
CREATE TRIGGER user_path_checklist_items_set_updated_at
BEFORE UPDATE ON user_path_checklist_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
