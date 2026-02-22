import crypto from 'node:crypto';
import { env } from '../../config/env.js';

function getByPath(input, path) {
  if (!path) return input;
  return path.split('.').reduce((value, segment) => {
    if (value && typeof value === 'object' && segment in value) {
      return value[segment];
    }
    return undefined;
  }, input);
}

function pick(raw, keys, fallback = null) {
  for (const key of keys) {
    const value = raw?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return fallback;
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const numeric = Number(String(value).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

function parseHeaders() {
  try {
    const parsed = JSON.parse(env.CUSTOM_JOBS_API_HEADERS_JSON || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function makeExternalId(raw, index) {
  const explicit = pick(raw, ['externalId', 'external_id', 'id', 'job_id', 'uuid']);
  if (explicit) return String(explicit);

  const seed = `${pick(raw, ['title', 'job_title', 'position'], 'job')}:${pick(raw, ['company', 'company_name', 'employer'], 'company')}:${index}`;
  return crypto.createHash('sha1').update(seed).digest('hex').slice(0, 20);
}

function normalizeItem(raw, index) {
  const title = pick(raw, ['title', 'job_title', 'position'], 'Untitled role');
  const company = pick(raw, ['company', 'company_name', 'employer'], 'Unknown company');
  const location = pick(raw, ['location', 'candidate_required_location', 'city', 'country'], 'Remote');
  const applyUrl = pick(raw, ['applyUrl', 'apply_url', 'url', 'job_url', 'application_url'], null);
  const sourceUrl = pick(raw, ['sourceUrl', 'source_url', 'url', 'job_url'], applyUrl);

  if (!applyUrl) {
    return null;
  }

  return {
    externalId: makeExternalId(raw, index),
    title: String(title),
    company: String(company),
    location: String(location),
    remoteType: pick(raw, ['remoteType', 'remote_type'], 'remote'),
    employmentType: pick(raw, ['employmentType', 'employment_type', 'job_type', 'type']),
    salaryMin: toNumber(pick(raw, ['salaryMin', 'salary_min', 'min_salary'])),
    salaryMax: toNumber(pick(raw, ['salaryMax', 'salary_max', 'max_salary'])),
    salaryCurrency: pick(raw, ['salaryCurrency', 'salary_currency', 'currency']),
    applyUrl: String(applyUrl),
    sourceUrl: sourceUrl ? String(sourceUrl) : String(applyUrl),
    description: pick(raw, ['description', 'summary', 'snippet'], ''),
    postedAt: pick(raw, ['postedAt', 'posted_at', 'publication_date', 'created_at', 'date_posted']),
    rawPayload: raw,
    careerHint: pick(raw, ['career', 'career_title', 'category'])
  };
}

export async function fetchCustomJobs({ limit = 40, search = '' } = {}) {
  if (!env.CUSTOM_JOBS_API_URL) {
    throw new Error('CUSTOM_JOBS_API_URL is required when JOBS_PROVIDER=custom');
  }

  const method = (env.CUSTOM_JOBS_API_METHOD || 'GET').toUpperCase();
  const headers = {
    Accept: 'application/json',
    ...parseHeaders()
  };

  let url = env.CUSTOM_JOBS_API_URL;
  const requestInit = { method, headers };

  if (method === 'GET') {
    const urlObject = new URL(url);
    if (search) urlObject.searchParams.set(env.CUSTOM_JOBS_SEARCH_PARAM, search);
    if (limit) urlObject.searchParams.set(env.CUSTOM_JOBS_LIMIT_PARAM, String(limit));
    url = urlObject.toString();
  } else {
    headers['Content-Type'] = 'application/json';
    requestInit.body = JSON.stringify({
      [env.CUSTOM_JOBS_SEARCH_PARAM]: search,
      [env.CUSTOM_JOBS_LIMIT_PARAM]: limit
    });
  }

  const response = await fetch(url, requestInit);
  if (!response.ok) {
    throw new Error(`Custom jobs API responded with ${response.status}`);
  }

  const payload = await response.json();

  let list;
  if (Array.isArray(payload)) {
    list = payload;
  } else {
    list = getByPath(payload, env.CUSTOM_JOBS_RESULTS_PATH);
  }

  if (!Array.isArray(list)) {
    throw new Error(
      `Custom jobs payload did not contain an array at CUSTOM_JOBS_RESULTS_PATH=${env.CUSTOM_JOBS_RESULTS_PATH}`
    );
  }

  return list.slice(0, limit).map(normalizeItem).filter(Boolean);
}
