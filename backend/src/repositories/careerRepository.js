import { query } from '../config/db.js';

export async function getCareerProfiles() {
  const { rows } = await query(
    `SELECT
      c.id,
      c.slug,
      c.title,
      c.description,
      c.experience_level,
      c.median_salary_usd,
      c.metadata,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'code', cr.riasec_code,
            'weight', cr.weight
          )
          ORDER BY cr.weight DESC
        )
        FROM career_riasec cr
        WHERE cr.career_id = c.id
      ), '[]'::json) AS riasec_profiles,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'code', cm.mbti_code,
            'weight', cm.weight
          )
          ORDER BY cm.weight DESC
        )
        FROM career_mbti cm
        WHERE cm.career_id = c.id
      ), '[]'::json) AS mbti_profiles,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'skillId', s.id,
            'name', s.name,
            'category', s.category,
            'importance', csr.importance,
            'minLevel', csr.min_level
          )
          ORDER BY csr.importance DESC
        )
        FROM career_skill_requirements csr
        JOIN skills s ON s.id = csr.skill_id
        WHERE csr.career_id = c.id
      ), '[]'::json) AS required_skills,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'certificationId', cert.id,
            'name', cert.name,
            'provider', cert.provider,
            'isRequired', ccr.is_required,
            'notes', ccr.notes
          )
          ORDER BY ccr.is_required DESC, cert.name ASC
        )
        FROM career_certification_requirements ccr
        JOIN certifications cert ON cert.id = ccr.certification_id
        WHERE ccr.career_id = c.id
      ), '[]'::json) AS certifications
    FROM careers c
    WHERE c.is_active = TRUE
    ORDER BY c.title ASC`
  );

  return rows;
}

export async function saveAnalysisRun({ userId = null, inputPayload, outputPayload }) {
  const normalizedUserId =
    typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)
      ? userId
      : null;

  await query(
    `INSERT INTO analysis_runs (user_id, input_payload, output_payload)
     VALUES ($1, $2::jsonb, $3::jsonb)`,
    [normalizedUserId, JSON.stringify(inputPayload), JSON.stringify(outputPayload)]
  );
}
