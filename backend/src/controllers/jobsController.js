import { z } from 'zod';
import { listJobs } from '../repositories/jobRepository.js';
import { syncJobsFromRemotive } from '../services/jobsSyncService.js';
import { HttpError } from '../utils/httpError.js';

const syncPayloadSchema = z.object({
  limit: z.number().int().positive().max(200).optional(),
  search: z.string().max(120).optional()
});

export async function getJobs(req, res) {
  const { limit, q, careerId } = req.query;
  const jobs = await listJobs({
    limit: limit ? Number(limit) : 20,
    q: typeof q === 'string' ? q : '',
    careerId: careerId ? Number(careerId) : null
  });

  res.json({
    success: true,
    data: jobs
  });
}

export async function syncJobs(req, res) {
  const parsed = syncPayloadSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid jobs sync payload', parsed.error.flatten());
  }

  const result = await syncJobsFromRemotive({
    limit: parsed.data.limit,
    search: parsed.data.search
  });

  res.status(202).json({
    success: true,
    data: result
  });
}
