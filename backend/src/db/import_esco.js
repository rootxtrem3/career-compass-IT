import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { pool } from "./pool.js";

const inputDir = process.argv[2];

if (!inputDir) {
  console.error("Usage: node src/db/import_esco.js /path/to/esco");
  process.exit(1);
}

function findFile(patterns) {
  const files = fs.readdirSync(inputDir);
  for (const pattern of patterns) {
    const match = files.find((file) => pattern.test(file));
    if (match) return path.join(inputDir, match);
  }
  return null;
}

function detectDelimiter(sample) {
  const commaCount = (sample.match(/,/g) || []).length;
  const semicolonCount = (sample.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

function loadCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const delimiter = detectDelimiter(content.split("\n")[0] || "");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    delimiter
  });
}

function pick(row, keys) {
  for (const key of keys) {
    if (row[key]) return row[key];
  }
  return "";
}

async function importEsco() {
  const occupationFile = findFile([/occupations.*\.csv$/i]);
  const skillFile = findFile([/skills.*\.csv$/i]);
  const relationFile = findFile([/occupationSkill.*\.csv$/i, /occupation.*skill.*\.csv$/i]);

  if (!occupationFile || !skillFile || !relationFile) {
    console.error("Missing ESCO files. Expected occupations.csv, skills.csv, occupationSkillRelations.csv");
    process.exit(1);
  }

  const occupations = loadCsv(occupationFile);
  const skills = loadCsv(skillFile);
  const relations = loadCsv(relationFile);

  if (!Array.isArray(occupations) || !Array.isArray(skills) || !Array.isArray(relations)) {
    throw new Error("Failed to parse ESCO CSV files. Check delimiter and file integrity.");
  }

  const skillMap = new Map();
  for (const row of skills) {
    const uri = pick(row, ["conceptUri", "uri", "skillUri"]);
    const name = pick(row, ["preferredLabel", "name", "label"]);
    if (!uri || !name) continue;
    const description = pick(row, ["description", "definition"]);
    const category = pick(row, ["skillType", "type", "reusabilityLevel", "skillTypeLabel"]) || "General";

    const skillResult = await pool.query(
      `INSERT INTO skills (name, category, difficulty, description, esco_uri)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (esco_uri) DO UPDATE
       SET name = EXCLUDED.name,
           category = EXCLUDED.category,
           description = COALESCE(EXCLUDED.description, skills.description)
       RETURNING id`,
      [name, category, 2, description || null, uri]
    );
    const skillId = skillResult.rows[0]?.id;
    if (skillId) {
      skillMap.set(uri, skillId);
    }
  }

  const careerMap = new Map();
  for (const row of occupations) {
    const uri = pick(row, ["conceptUri", "uri", "occupationUri"]);
    const title = pick(row, ["preferredLabel", "title", "name", "label"]);
    if (!uri || !title) continue;
    const description = pick(row, ["description", "definition"]);

    const careerResult = await pool.query(
      `INSERT INTO careers (title, description, esco_uri)
       VALUES ($1, $2, $3)
       ON CONFLICT (esco_uri) DO UPDATE
       SET title = EXCLUDED.title,
           description = COALESCE(EXCLUDED.description, careers.description)
       RETURNING id`,
      [title, description || "No description available.", uri]
    );
    const careerId = careerResult.rows[0]?.id;
    if (careerId) {
      careerMap.set(uri, careerId);
    }
  }

  for (const row of relations) {
    const occupationUri = pick(row, ["occupationUri", "occupation", "occupationConceptUri"]);
    const skillUri = pick(row, ["skillUri", "skill", "skillConceptUri"]);
    if (!occupationUri || !skillUri) continue;
    const careerId = careerMap.get(occupationUri);
    const skillId = skillMap.get(skillUri);
    if (!careerId || !skillId) continue;

    const relation = pick(row, ["relationType", "relationshipType", "essential"]);
    const weight = relation?.toLowerCase().includes("essential") ? 0.85 : 0.55;

    await pool.query(
      `INSERT INTO career_skills (career_id, skill_id, importance_weight)
       VALUES ($1, $2, $3)
       ON CONFLICT (career_id, skill_id) DO NOTHING`,
      [careerId, skillId, weight]
    );
  }
}

importEsco()
  .then(() => {
    console.log("ESCO import complete.");
    return pool.end();
  })
  .catch((error) => {
    console.error("ESCO import failed", error);
    pool.end();
  });
