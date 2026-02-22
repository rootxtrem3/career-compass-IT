import { getWorldStats } from '../repositories/statsRepository.js';

export async function getWorldCareerStats(_req, res) {
  const stats = await getWorldStats();
  res.json({
    success: true,
    data: stats
  });
}
