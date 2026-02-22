import { z } from 'zod';
import { analyzeCareerFit } from '../services/analysisService.js';
import { HttpError } from '../utils/httpError.js';

const payloadSchema = z.object({
  riasecCodes: z.array(z.enum(['R', 'I', 'A', 'S', 'E', 'C'])).min(1).max(3),
  mbtiCode: z.string().length(4),
  skillIds: z.array(z.number().int().positive()).min(1)
});

export async function getRecommendations(req, res) {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid analysis payload', parsed.error.flatten());
  }

  const recommendations = await analyzeCareerFit({
    selectedSkillIds: parsed.data.skillIds,
    selectedMbti: parsed.data.mbtiCode.toUpperCase(),
    selectedRiasec: parsed.data.riasecCodes,
    userId: req.user?.sub || null
  });

  res.json({
    success: true,
    data: recommendations
  });
}
