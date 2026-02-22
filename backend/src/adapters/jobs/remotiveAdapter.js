const REMOTIVE_API_URL = 'https://remotive.com/api/remote-jobs';

export async function fetchRemotiveJobs({ limit = 40, search = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);

  const url = `${REMOTIVE_API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Remotive API responded with ${response.status}`);
  }

  const payload = await response.json();
  const jobs = Array.isArray(payload.jobs) ? payload.jobs.slice(0, limit) : [];

  return jobs.map((job) => ({
    externalId: String(job.id),
    title: job.title || 'Untitled role',
    company: job.company_name || 'Unknown company',
    location: job.candidate_required_location || 'Remote',
    remoteType: 'remote',
    employmentType: job.job_type || null,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    applyUrl: job.url,
    sourceUrl: job.url,
    description: job.description || '',
    postedAt: job.publication_date || null,
    rawPayload: job
  }));
}

export function getFallbackRemotiveJobs() {
  return [
    {
      externalId: 'fallback-1',
      title: 'Junior Product Analyst',
      company: 'Compass Labs',
      location: 'Remote - Global',
      remoteType: 'remote',
      employmentType: 'full_time',
      salaryMin: 65000,
      salaryMax: 82000,
      salaryCurrency: 'USD',
      applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Product%20Analyst',
      sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Product%20Analyst',
      description: 'Analyze product usage data and support cross-functional planning.',
      postedAt: new Date().toISOString(),
      rawPayload: { fallback: true }
    },
    {
      externalId: 'fallback-2',
      title: 'Remote UX Designer',
      company: 'North Pixel',
      location: 'Remote - Europe',
      remoteType: 'remote',
      employmentType: 'contract',
      salaryMin: 70000,
      salaryMax: 90000,
      salaryCurrency: 'USD',
      applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=UX%20Designer',
      sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=UX%20Designer',
      description: 'Design user journeys, wireframes, and high-fidelity interfaces.',
      postedAt: new Date().toISOString(),
      rawPayload: { fallback: true }
    }
  ];
}
