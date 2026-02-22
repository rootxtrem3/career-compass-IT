import { env } from '../config/env.js';
import { getCareerProfiles } from '../repositories/careerRepository.js';
import { ensureJobSource, upsertJobs } from '../repositories/jobRepository.js';
import { fetchCustomJobs } from '../adapters/jobs/customAdapter.js';
import { fetchAdzunaJobs } from '../adapters/jobs/adzunaAdapter.js';
import { fetchRemotiveJobs, getFallbackRemotiveJobs } from '../adapters/jobs/remotiveAdapter.js';

function rankCareerMatch(title, careerProfiles) {
  const normalizedTitle = title.toLowerCase();
  let best = { careerId: null, score: 0 };

  for (const career of careerProfiles) {
    const titleTokens = career.title.toLowerCase().split(/\s+/);
    let score = 0;

    for (const token of titleTokens) {
      if (token.length < 3) continue;
      if (normalizedTitle.includes(token)) {
        score += 1;
      }
    }

    if (normalizedTitle.includes(career.slug.replace(/-/g, ' '))) {
      score += 2;
    }

    if (score > best.score) {
      best = { careerId: career.id, score };
    }
  }

  return best.score > 0 ? best.careerId : null;
}

export async function syncJobsFromRemotive({ limit = env.JOBS_SYNC_LIMIT, search = '' } = {}) {
  const provider = env.JOBS_PROVIDER;
  let sourceKey = 'remotive';
  let baseUrl = 'https://remotive.com/api/remote-jobs';

  if (provider === 'custom') {
    sourceKey = 'custom';
    baseUrl = env.CUSTOM_JOBS_API_URL || 'custom://jobs-api';
  }

  if (provider === 'adzuna') {
    sourceKey = 'adzuna';
    baseUrl = 'https://api.adzuna.com/v1/api/jobs';
  }

  const source = await ensureJobSource(sourceKey, baseUrl);

  const careers = await getCareerProfiles();

  let jobs;
  let fallbackUsed = false;
  let providerError = null;

  try {
    if (provider === 'adzuna') {
      jobs = await fetchAdzunaJobs({ limit, search });
    } else if (provider === 'custom') {
      jobs = await fetchCustomJobs({ limit, search });
    } else {
      jobs = await fetchRemotiveJobs({ limit, search });
    }
  } catch (error) {
    providerError = error.message;
    fallbackUsed = true;
    jobs = getFallbackRemotiveJobs();
    console.warn(`${provider} sync failed. Using fallback jobs.`, error.message);
  }

  const normalizedJobs = jobs.map((job) => ({
    ...job,
    careerId: rankCareerMatch(job.title, careers)
  }));

  const upsertResult = await upsertJobs(source.id, normalizedJobs);

  return {
    fetched: normalizedJobs.length,
    saved: upsertResult.count,
    source: source.source_key,
    provider,
    providerError,
    fallbackUsed
  };
}
