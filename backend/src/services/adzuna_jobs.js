import { config } from "../utils/config.js";
import { pool } from "../db/pool.js";

const RESULTS_PER_PAGE = 20;

async function fetchPage(page) {
  const baseUrl = `https://api.adzuna.com/v1/api/jobs/${config.ADZUNA_COUNTRY}/search/${page}`;
  const params = new URLSearchParams({
    app_id: config.ADZUNA_APP_ID,
    app_key: config.ADZUNA_APP_KEY,
    results_per_page: String(RESULTS_PER_PAGE),
    "content-type": "application/json"
  });
  const query = (config.ADZUNA_QUERY && config.ADZUNA_QUERY.trim()) || "software";
  params.set("what", query);

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Adzuna fetch failed: ${response.status} ${body}`);
  }
  return response.json();
}

function normalizeTitle(title) {
  return title.replace(/\s+/g, " ").trim();
}

export async function syncLatestJobs() {
  const data = await fetchPage(1);
  const results = Array.isArray(data.results) ? data.results : [];

  for (const job of results) {
    const title = normalizeTitle(job.title || "Unknown Role");
    await pool.query(
      `INSERT INTO jobs (source, external_id, title, company, location, posted_at, apply_url, raw, career_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL)
       ON CONFLICT (source, external_id) DO UPDATE
       SET title = EXCLUDED.title,
           company = EXCLUDED.company,
           location = EXCLUDED.location,
           posted_at = EXCLUDED.posted_at,
           apply_url = EXCLUDED.apply_url,
           raw = EXCLUDED.raw`,
      [
        "adzuna",
        job.id ? String(job.id) : title,
        title,
        job.company?.display_name ?? null,
        job.location?.display_name ?? null,
        job.created ?? null,
        job.redirect_url ?? null,
        job
      ]
    );
  }
}
