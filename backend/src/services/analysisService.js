import { scoreCareer } from '../algorithms/careerScoring.js';
import { getCareerProfiles, saveAnalysisRun } from '../repositories/careerRepository.js';
import { getLatestJobsByCareerIds } from '../repositories/jobRepository.js';
import { saveUserAnalysisHistory } from './trackingService.js';

export async function analyzeCareerFit({ selectedSkillIds, selectedMbti, selectedRiasec, userId = null }) {
  const careers = await getCareerProfiles();

  const selectedSkillSet = new Set(selectedSkillIds.map((value) => Number(value)));
  const selectedRiasecSet = new Set(selectedRiasec);

  const scored = careers
    .map((career) =>
      scoreCareer({
        career,
        selectedSkillIds: selectedSkillSet,
        selectedMbti,
        selectedRiasec: selectedRiasecSet
      })
    )
    .filter((result) => result.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const jobsByCareer = await getLatestJobsByCareerIds(
    scored.map((item) => item.careerId),
    3
  );

  const result = scored.map((item) => ({
    ...item,
    opportunities: jobsByCareer.get(item.careerId) || []
  }));

  await saveAnalysisRun({
    userId,
    inputPayload: {
      selectedSkillIds,
      selectedMbti,
      selectedRiasec
    },
    outputPayload: result
  });

  await saveUserAnalysisHistory({
    firebaseUid: userId,
    mbtiCode: selectedMbti,
    riasecCodes: selectedRiasec,
    selectedSkillIds,
    topRecommendations: result
  });

  return result;
}
