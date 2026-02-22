import { env } from '../../config/env.js';

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const numeric = Number(String(value).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

export async function fetchAdzunaJobs({ limit = 40, search = '' } = {}) {
  if (!env.ADZUNA_APP_ID || !env.ADZUNA_API_KEY) {
    throw new Error('ADZUNA_APP_ID and ADZUNA_API_KEY are required when JOBS_PROVIDER=adzuna');
  }

  const country = env.ADZUNA_COUNTRY || 'us';
  const page = Math.max(1, Number(env.ADZUNA_PAGE || 1));

  const url = new URL(`${ADZUNA_BASE_URL}/${country}/search/${page}`);
  url.searchParams.set('app_id', env.ADZUNA_APP_ID);
  url.searchParams.set('app_key', env.ADZUNA_API_KEY);
  url.searchParams.set('results_per_page', String(Math.min(Math.max(limit, 1), 50)));
  if (search) url.searchParams.set('what', search);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Adzuna API responded with ${response.status}`);
  }

  const payload = await response.json();
  const jobs = Array.isArray(payload.results) ? payload.results : [];

  return jobs.map((job) => ({
    externalId: String(job.id || `${job.title}-${job.redirect_url || ''}`),
    title: job.title || 'Untitled role',
    company: job.company?.display_name || 'Unknown company',
    location: job.location?.display_name || 'Remote',
    remoteType: 'remote',
    employmentType: job.contract_time || job.contract_type || null,
    salaryMin: toNumber(job.salary_min),
    salaryMax: toNumber(job.salary_max),
    salaryCurrency: 'USD',
    applyUrl: job.redirect_url || null,
    sourceUrl: job.redirect_url || null,
    description: job.description || '',
    postedAt: job.created || null,
    rawPayload: job
  })).filter((job) => Boolean(job.applyUrl));
}
