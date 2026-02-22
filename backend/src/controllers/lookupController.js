import { getMbtiOptions, getRiasecOptions, getSkills } from '../repositories/lookupRepository.js';

export async function getLookups(_req, res) {
  const [riasec, mbti, skills] = await Promise.all([
    getRiasecOptions(),
    getMbtiOptions(),
    getSkills()
  ]);

  res.json({
    success: true,
    data: {
      riasec,
      mbti,
      skills
    }
  });
}
