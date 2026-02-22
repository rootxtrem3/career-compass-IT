import { query, withTransaction } from '../config/db.js';

export async function insertAnalysisHistory({
  firebaseUid,
  mbtiCode,
  riasecCodes,
  selectedSkillIds,
  topCareerIds,
  topSnapshot
}) {
  await query(
    `INSERT INTO user_analysis_history (
      firebase_uid,
      mbti_code,
      riasec_codes,
      selected_skill_ids,
      top_career_ids,
      top_snapshot
    ) VALUES ($1, $2, $3::text[], $4::int[], $5::int[], $6::jsonb)`,
    [
      firebaseUid,
      mbtiCode,
      riasecCodes,
      selectedSkillIds,
      topCareerIds,
      JSON.stringify(topSnapshot)
    ]
  );
}

export async function getAnalysisHistory(firebaseUid, limit = 20) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const { rows } = await query(
    `SELECT
      h.id,
      h.mbti_code AS "mbtiCode",
      h.riasec_codes AS "riasecCodes",
      h.selected_skill_ids AS "selectedSkillIds",
      h.top_career_ids AS "topCareerIds",
      h.top_snapshot AS "topSnapshot",
      h.created_at AS "createdAt"
    FROM user_analysis_history h
    WHERE h.firebase_uid = $1
    ORDER BY h.created_at DESC
    LIMIT $2`,
    [firebaseUid, safeLimit]
  );

  return rows;
}

export async function getCareerRequirementsByCareerId(careerId) {
  const { rows } = await query(
    `SELECT
      c.id AS "careerId",
      c.title,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'itemType', 'skill',
            'itemRefId', s.id,
            'label', s.name || ' (' || csr.min_level || ')',
            'isRequired', TRUE
          ) ORDER BY csr.importance DESC
        )
        FROM career_skill_requirements csr
        JOIN skills s ON s.id = csr.skill_id
        WHERE csr.career_id = c.id
      ), '[]'::json) AS skills,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'itemType', 'certification',
            'itemRefId', cert.id,
            'label', cert.name,
            'isRequired', ccr.is_required
          ) ORDER BY ccr.is_required DESC, cert.name ASC
        )
        FROM career_certification_requirements ccr
        JOIN certifications cert ON cert.id = ccr.certification_id
        WHERE ccr.career_id = c.id
      ), '[]'::json) AS certifications
    FROM careers c
    WHERE c.id = $1
    LIMIT 1`,
    [careerId]
  );

  return rows[0] || null;
}

export async function bootstrapChecklistForCareer(firebaseUid, careerId, items) {
  return withTransaction(async (client) => {
    for (const item of items) {
      await client.query(
        `INSERT INTO user_path_checklist_items (
          firebase_uid,
          career_id,
          item_type,
          item_ref_id,
          label,
          is_required
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (firebase_uid, career_id, item_type, item_ref_id)
        DO NOTHING`,
        [firebaseUid, careerId, item.itemType, item.itemRefId, item.label, item.isRequired]
      );
    }

    const { rows } = await client.query(
      `SELECT
        i.id,
        i.career_id AS "careerId",
        c.title AS "careerTitle",
        i.item_type AS "itemType",
        i.item_ref_id AS "itemRefId",
        i.label,
        i.is_required AS "isRequired",
        i.completed,
        i.completed_at AS "completedAt",
        i.updated_at AS "updatedAt"
      FROM user_path_checklist_items i
      JOIN careers c ON c.id = i.career_id
      WHERE i.firebase_uid = $1
        AND i.career_id = $2
      ORDER BY i.item_type ASC, i.is_required DESC, i.id ASC`,
      [firebaseUid, careerId]
    );

    return rows;
  });
}

export async function getChecklist(firebaseUid, careerId = null) {
  const params = [firebaseUid];
  let careerClause = '';

  if (careerId) {
    params.push(Number(careerId));
    careerClause = ` AND i.career_id = $${params.length}`;
  }

  const { rows } = await query(
    `SELECT
      i.id,
      i.career_id AS "careerId",
      c.title AS "careerTitle",
      i.item_type AS "itemType",
      i.item_ref_id AS "itemRefId",
      i.label,
      i.is_required AS "isRequired",
      i.completed,
      i.completed_at AS "completedAt",
      i.updated_at AS "updatedAt"
    FROM user_path_checklist_items i
    JOIN careers c ON c.id = i.career_id
    WHERE i.firebase_uid = $1
    ${careerClause}
    ORDER BY i.career_id ASC, i.item_type ASC, i.is_required DESC, i.id ASC`,
    params
  );

  return rows;
}

export async function updateChecklistItem(firebaseUid, itemId, completed) {
  const { rows } = await query(
    `UPDATE user_path_checklist_items
     SET completed = $3,
         completed_at = CASE WHEN $3 = TRUE THEN NOW() ELSE NULL END
     WHERE firebase_uid = $1
       AND id = $2
     RETURNING
       id,
       career_id AS "careerId",
       item_type AS "itemType",
       item_ref_id AS "itemRefId",
       label,
       is_required AS "isRequired",
       completed,
       completed_at AS "completedAt",
       updated_at AS "updatedAt"`,
    [firebaseUid, Number(itemId), completed]
  );

  return rows[0] || null;
}
