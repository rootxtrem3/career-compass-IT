import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";
import xlsx from "xlsx";
import { parse } from "csv-parse/sync";
import { pool } from "./pool.js";

const inputDir = process.argv[2];

if (!inputDir) {
  console.error("Usage: node src/db/import_onet.js /path/to/onet");
  process.exit(1);
}

function loadTsv(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    delimiter: "\t"
  });
}

function loadXlsx(filePath) {
  const workbook = xlsx.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { defval: "" });
}

function loadData(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt" || ext === ".tsv") return loadTsv(filePath);
  if (ext === ".xlsx") return loadXlsx(filePath);
  throw new Error(`Unsupported O*NET file format: ${ext}`);
}

function findFile(dir, patterns) {
  const files = fs.readdirSync(dir);
  for (const pattern of patterns) {
    const match = files.find((file) => pattern.test(file));
    if (match) return path.join(dir, match);
  }
  return null;
}

function resolveInputDir(rawInput) {
  if (rawInput.toLowerCase().endsWith(".zip")) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "onet-"));
    execSync(`unzip -q "${rawInput}" -d "${tmpDir}"`);
    const entries = fs.readdirSync(tmpDir, { withFileTypes: true });
    const firstDir = entries.find((entry) => entry.isDirectory());
    return firstDir ? path.join(tmpDir, firstDir.name) : tmpDir;
  }
  return rawInput;
}

function normalizeTitle(title) {
  return title.replace(/\s+/g, " ").trim();
}

async function importOnet() {
  const baseDir = resolveInputDir(inputDir);
  const occupationsPath = findFile(baseDir, [/Occupation Data\.txt$/i, /Occupation Data\.xlsx$/i]);
  const interestsPath = findFile(baseDir, [/Interests\.txt$/i, /Interests\.xlsx$/i]);

  if (!occupationsPath || !interestsPath) {
    console.error("Missing O*NET files: Occupation Data.(txt|xlsx) and Interests.(txt|xlsx)");
    process.exit(1);
  }

  const occupations = loadData(occupationsPath);
  const interests = loadData(interestsPath);

  if (!Array.isArray(occupations) || !Array.isArray(interests)) {
    throw new Error("Failed to parse O*NET files. Check file format and integrity.");
  }

  const interestMap = new Map();
  for (const row of interests) {
    const code = row["O*NET-SOC Code"] || row["O*NET-SOC code"];
    const element = row["Element Name"] || row["Element"];
    const value = Number(row["Data Value"] || row["Value"]);
    if (!code || !element || Number.isNaN(value)) continue;
    if (!interestMap.has(code)) interestMap.set(code, []);
    interestMap.get(code).push({ element, value });
  }

  for (const row of occupations) {
    const code = row["O*NET-SOC Code"] || row["O*NET-SOC code"];
    const title = normalizeTitle(row["Title"] || row["Occupation"] || "");
    const description = row["Description"] || "No description available.";
    if (!code || !title) continue;

    const interestRows = interestMap.get(code) || [];
    const sorted = interestRows
      .filter((item) =>
        ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"].includes(
          item.element
        )
      )
      .sort((a, b) => b.value - a.value);
    const riasec = sorted.slice(0, 3).map((item) => item.element[0]).join("");

    const existing = await pool.query(`SELECT id FROM careers WHERE onet_code = $1`, [code]);
    if (existing.length === 0) {
      const matchByTitle = await pool.query(
        `SELECT id FROM careers WHERE LOWER(title) = LOWER($1) LIMIT 1`,
        [title]
      );
      if (matchByTitle.length > 0) {
        await pool.query(
          `UPDATE careers SET onet_code = $1, description = $2, riasec_code = $3 WHERE id = $4`,
          [code, description, riasec || null, matchByTitle[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO careers (title, description, onet_code, riasec_code)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (onet_code) DO UPDATE
           SET title = EXCLUDED.title,
               description = EXCLUDED.description,
               riasec_code = EXCLUDED.riasec_code`,
          [title, description, code, riasec || null]
        );
      }
    } else {
      await pool.query(
        `UPDATE careers SET title = $1, description = $2, riasec_code = $3 WHERE onet_code = $4`,
        [title, description, riasec || null, code]
      );
    }
  }
}

importOnet()
  .then(() => {
    console.log("O*NET import complete.");
    return pool.end();
  })
  .catch((error) => {
    console.error("O*NET import failed", error);
    pool.end();
  });
