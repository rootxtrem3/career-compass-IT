ALTER TABLE careers ADD COLUMN IF NOT EXISTS onet_code TEXT;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS esco_uri TEXT;

ALTER TABLE skills ADD COLUMN IF NOT EXISTS esco_uri TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS careers_onet_code_unique ON careers (onet_code);
CREATE UNIQUE INDEX IF NOT EXISTS careers_esco_uri_unique ON careers (esco_uri);
CREATE UNIQUE INDEX IF NOT EXISTS skills_esco_uri_unique ON skills (esco_uri);
