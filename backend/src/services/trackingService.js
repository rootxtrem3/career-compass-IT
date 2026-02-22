import { HttpError } from '../utils/httpError.js';
import {
  bootstrapChecklistForCareer,
  getAnalysisHistory,
  getCareerRequirementsByCareerId,
  getChecklist,
  insertAnalysisHistory,
  updateChecklistItem
} from '../repositories/trackingRepository.js';

export async function saveUserAnalysisHistory({
  firebaseUid,
  mbtiCode,
  riasecCodes,
  selectedSkillIds,
  topRecommendations
}) {
  if (!firebaseUid) return;

  await insertAnalysisHistory({
    firebaseUid,
    mbtiCode,
    riasecCodes,
    selectedSkillIds,
    topCareerIds: topRecommendations.map((item) => item.careerId),
    topSnapshot: topRecommendations.map((item) => ({
      careerId: item.careerId,
      title: item.title,
      score: item.score,
      breakdown: item.breakdown
    }))
  });
}

export async function listUserAnalysisHistory(firebaseUid, limit) {
  return getAnalysisHistory(firebaseUid, limit);
}

export async function bootstrapPathChecklist(firebaseUid, careerId) {
  const requirements = await getCareerRequirementsByCareerId(careerId);
  if (!requirements) {
    throw new HttpError(404, 'Career not found');
  }

  const items = [...(requirements.skills || []), ...(requirements.certifications || [])];

  return bootstrapChecklistForCareer(firebaseUid, careerId, items);
}

export async function listChecklist(firebaseUid, careerId) {
  return getChecklist(firebaseUid, careerId);
}

export async function setChecklistCompletion(firebaseUid, itemId, completed) {
  const row = await updateChecklistItem(firebaseUid, itemId, completed);
  if (!row) {
    throw new HttpError(404, 'Checklist item not found');
  }
  return row;
}
