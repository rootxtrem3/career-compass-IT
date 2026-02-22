import { withTransaction, query } from '../config/db.js';

export async function getJobSourceByKey(sourceKey) {
  const { rows } = await query(
    'SELECT id, source_key, base_url FROM job_sources WHERE source_key = $1 AND is_active = TRUE LIMIT 1',
    [sourceKey]
  );
  return rows[0] || null;
}

export async function ensureJobSource(sourceKey, baseUrl) {
  const { rows } = await query(
    `INSERT INTO job_sources (source_key, base_url, is_active)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (source_key)
     DO UPDATE SET
       base_url = EXCLUDED.base_url,
       is_active = TRUE
     RETURNING id, source_key, base_url`,
    [sourceKey, baseUrl]
  );

  return rows[0];
}

export async function upsertJobs(sourceId, normalizedJobs) {
  return withTransaction(async (client) => {
    let inserted = 0;

    for (const job of normalizedJobs) {
      const result = await client.query(
        `INSERT INTO jobs (
           source_id, external_id, career_id, title, company, location, remote_type,
           employment_type, salary_min, salary_max, salary_currency,
           apply_url, source_url, description, posted_at, raw_payload, fetched_at
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7,
           $8, $9, $10, $11,
           $12, $13, $14, $15, $16::jsonb, NOW()
         )
         ON CONFLICT (source_id, external_id)
         DO UPDATE SET
           career_id = EXCLUDED.career_id,
           title = EXCLUDED.title,
           company = EXCLUDED.company,
           location = EXCLUDED.location,
           remote_type = EXCLUDED.remote_type,
           employment_type = EXCLUDED.employment_type,
           salary_min = EXCLUDED.salary_min,
           salary_max = EXCLUDED.salary_max,
           salary_currency = EXCLUDED.salary_currency,
           apply_url = EXCLUDED.apply_url,
           source_url = EXCLUDED.source_url,
           description = EXCLUDED.description,
           posted_at = EXCLUDED.posted_at,
           raw_payload = EXCLUDED.raw_payload,
           fetched_at = NOW()
         RETURNING id`,
        [
          sourceId,
          job.externalId,
          job.careerId || null,
          job.title,
          job.company,
          job.location,
          job.remoteType,
          job.employmentType,
          job.salaryMin,
          job.salaryMax,
          job.salaryCurrency,
          job.applyUrl,
          job.sourceUrl,
          job.description,
          job.postedAt,
          JSON.stringify(job.rawPayload || {})
        ]
      );

      if (result.rowCount > 0) inserted += 1;
    }

    return { count: inserted };
  });
}

export async function listJobs({ limit = 20, q = '', careerId = null }) {
  const values = [];
  const filters = [];

  if (q.trim()) {
    values.push(`%${q.trim()}%`);
    filters.push(`(j.title ILIKE $${values.length} OR j.company ILIKE $${values.length})`);
  }

  if (careerId) {
    values.push(Number(careerId));
    filters.push(`j.career_id = $${values.length}`);
  }

  values.push(Math.min(Math.max(Number(limit) || 20, 1), 100));

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const { rows } = await query(
    `SELECT
      j.id,
      j.title,
      j.company,
      j.location,
      j.remote_type AS "remoteType",
      j.employment_type AS "employmentType",
      j.apply_url AS "applyUrl",
      j.source_url AS "sourceUrl",
      'https://www.linkedin.com/jobs/search/?keywords=' ||
        replace(j.title || ' ' || COALESCE(j.company, ''), ' ', '%20') AS "linkedinUrl",
      j.posted_at AS "postedAt",
      j.fetched_at AS "fetchedAt",
      c.id AS "careerId",
      c.title AS "careerTitle",
      src.source_key AS source
     FROM jobs j
     JOIN job_sources src ON src.id = j.source_id
     LEFT JOIN careers c ON c.id = j.career_id
     ${whereClause}
     ORDER BY COALESCE(j.posted_at, j.fetched_at) DESC, j.id DESC
     LIMIT $${values.length}`,
    values
  );

  return rows;
}

export async function getLatestJobsByCareerIds(careerIds, perCareer = 3) {
  if (!Array.isArray(careerIds) || !careerIds.length) {
    return new Map();
  }

  const { rows } = await query(
    `SELECT *
     FROM (
       SELECT
         j.id,
         j.career_id AS "careerId",
         j.title,
         j.company,
         j.location,
         j.remote_type AS "remoteType",
         j.employment_type AS "employmentType",
         j.apply_url AS "applyUrl",
         j.source_url AS "sourceUrl",
         'https://www.linkedin.com/jobs/search/?keywords=' ||
           replace(j.title || ' ' || COALESCE(j.company, ''), ' ', '%20') AS "linkedinUrl",
         j.posted_at AS "postedAt",
         src.source_key AS source,
         ROW_NUMBER() OVER (
           PARTITION BY j.career_id
           ORDER BY COALESCE(j.posted_at, j.fetched_at) DESC, j.id DESC
         ) AS position
       FROM jobs j
       JOIN job_sources src ON src.id = j.source_id
       WHERE j.career_id = ANY($1::int[])
     ) ranked
     WHERE ranked.position <= $2`,
    [careerIds, perCareer]
  );

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.careerId)) {
      map.set(row.careerId, []);
    }
    map.get(row.careerId).push(row);
  }
  return map;
}
