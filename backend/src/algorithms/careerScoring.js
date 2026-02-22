const DEFAULT_WEIGHTS = {
  skills: 0.5,
  mbti: 0.2,
  riasec: 0.3
};

function ratio(value, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(1, value / total));
}

export function scoreCareer({ career, selectedSkillIds, selectedMbti, selectedRiasec }) {
  const requiredSkills = career.required_skills || [];
  const riasecProfiles = career.riasec_profiles || [];
  const mbtiProfiles = career.mbti_profiles || [];

  const totalSkillWeight = requiredSkills.reduce((sum, item) => sum + Number(item.importance || 0), 0);
  const matchedSkills = requiredSkills.filter((item) => selectedSkillIds.has(Number(item.skillId)));
  const matchedSkillWeight = matchedSkills.reduce((sum, item) => sum + Number(item.importance || 0), 0);
  const skillCoverage = ratio(matchedSkillWeight, totalSkillWeight);

  const totalRiasecWeight = riasecProfiles.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const matchedRiasec = riasecProfiles.filter((item) => selectedRiasec.has(item.code));
  const matchedRiasecWeight = matchedRiasec.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const riasecCoverage = ratio(matchedRiasecWeight, totalRiasecWeight);

  const mbtiMatch = mbtiProfiles.find((item) => item.code === selectedMbti);
  const mbtiScore = mbtiMatch ? Number(mbtiMatch.weight || 0) : 0;

  const totalScore = Math.round(
    (skillCoverage * DEFAULT_WEIGHTS.skills +
      riasecCoverage * DEFAULT_WEIGHTS.riasec +
      mbtiScore * DEFAULT_WEIGHTS.mbti) *
      100
  );

  const skillGaps = requiredSkills
    .filter((item) => !selectedSkillIds.has(Number(item.skillId)))
    .sort((a, b) => Number(b.importance) - Number(a.importance))
    .map((item) => ({
      skillId: Number(item.skillId),
      skillName: item.name,
      importance: Number(item.importance),
      recommendedLevel: item.minLevel
    }));

  return {
    careerId: career.id,
    slug: career.slug,
    title: career.title,
    description: career.description,
    experienceLevel: career.experience_level,
    medianSalaryUsd: career.median_salary_usd,
    score: Math.min(99, Math.max(0, totalScore)),
    breakdown: {
      skillCoverage: Number((skillCoverage * 100).toFixed(1)),
      riasecCoverage: Number((riasecCoverage * 100).toFixed(1)),
      mbtiAlignment: Number((mbtiScore * 100).toFixed(1))
    },
    matched: {
      skills: matchedSkills.map((item) => item.name),
      riasec: matchedRiasec.map((item) => item.code),
      mbti: mbtiMatch ? selectedMbti : null
    },
    skillGaps,
    certifications: (career.certifications || []).map((item) => ({
      certificationId: item.certificationId,
      name: item.name,
      provider: item.provider,
      isRequired: Boolean(item.isRequired),
      notes: item.notes || null
    }))
  };
}
