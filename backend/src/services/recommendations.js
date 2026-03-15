import { query } from "../db/pool.js";

function riasecScore(userCode, careerCode) {
  if (!userCode || !careerCode) return 0.3;
  const weights = [0.5, 0.3, 0.2];
  const userLetters = new Set(userCode.split(""));
  return careerCode
    .split("")
    .slice(0, 3)
    .reduce((sum, char, index) => sum + (userLetters.has(char) ? weights[index] : 0), 0);
}

function mbtiScore(userType, mbtiMap, careerId) {
  if (!userType) return 0.3;
  const direct = mbtiMap.get(`${careerId}:${userType}`);
  if (direct != null) return Number(direct);
  return userType.split("").reduce((sum, char, index) => sum + (char === userType[index] ? 1 : 0), 0) / 4;
}

function demandScore(level) {
  if (!level) return 0.3;
  const value = level.toLowerCase();
  if (value === "high") return 1;
  if (value === "medium") return 0.6;
  if (value === "low") return 0.4;
  if (value === "emerging") return 0.3;
  return 0.3;
}

export async function getRecommendations(userId, limit = 15) {
  const [user] = await query(`SELECT id, mbti_type, riasec_code FROM users WHERE id = $1`, [
    userId
  ]);
  if (!user) {
    throw new Error("User not found.");
  }

  const careers = await query(
    `SELECT *
     FROM careers
     WHERE esco_uri IS NOT NULL OR onet_code IS NOT NULL`
  );
  const userSkills = await query(`SELECT skill_id, level FROM user_skills WHERE user_id = $1`, [
    userId
  ]);
  const skillMap = new Map(userSkills.map((skill) => [skill.skill_id, skill.level]));

  const careerSkills = await query(
    `SELECT career_id, skill_id, importance_weight FROM career_skills`
  );

  const mbtiWeights = await query(`SELECT career_id, mbti_type, weight FROM career_mbti`);

  const mbtiMap = new Map(
    mbtiWeights.map((row) => [`${row.career_id}:${row.mbti_type}`, row.weight])
  );

  const recommendations = careers.map((career) => {
    const careerSkillRows = careerSkills.filter((row) => row.career_id === career.id);
    const totalWeight = careerSkillRows.reduce((sum, row) => sum + Number(row.importance_weight), 0);
    const weightedSkillScore = careerSkillRows.reduce((sum, row) => {
      const level = skillMap.get(row.skill_id) ?? 0;
      return sum + (level / 4) * Number(row.importance_weight);
    }, 0);
    const baseSkillScore = totalWeight === 0 ? 0.3 : weightedSkillScore / totalWeight;
    const coverage =
      careerSkillRows.length === 0
        ? 0.3
        : careerSkillRows.filter((row) => (skillMap.get(row.skill_id) ?? 0) > 0).length /
          careerSkillRows.length;
    const skillScore = baseSkillScore * 0.7 + coverage * 0.3;

    const riasec = riasecScore(user.riasec_code, career.riasec_code);
    const mbtiWeight = mbtiScore(user.mbti_type, mbtiMap, career.id);
    const overall = riasec * 0.4 + mbtiWeight * 0.25 + skillScore * 0.35;
    const salaryMid =
      career.salary_min && career.salary_max
        ? (Number(career.salary_min) + Number(career.salary_max)) / 2
        : 0;
    const demand = demandScore(career.demand_level);
    const growth = career.growth_rate ? Number(career.growth_rate) : 0;

    return {
      career,
      rawScore: overall,
      score: Number((overall * 100).toFixed(4)),
      breakdown: {
        riasec: Number((riasec * 100).toFixed(4)),
        mbti: Number((mbtiWeight * 100).toFixed(4)),
        skills: Number((skillScore * 100).toFixed(4)),
        coverage: Number((coverage * 100).toFixed(4))
      },
      demand,
      growth,
      salaryMid
    };
  });

  return recommendations
    .sort((a, b) => {
      if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
      if (b.breakdown.skills !== a.breakdown.skills) return b.breakdown.skills - a.breakdown.skills;
      if (b.breakdown.riasec !== a.breakdown.riasec) return b.breakdown.riasec - a.breakdown.riasec;
      if (b.breakdown.mbti !== a.breakdown.mbti) return b.breakdown.mbti - a.breakdown.mbti;
      if (b.demand !== a.demand) return b.demand - a.demand;
      if (b.growth !== a.growth) return b.growth - a.growth;
      return b.salaryMid - a.salaryMid;
    })
    .slice(0, limit)
    .map((entry) => ({
      ...entry.career,
      compatibility_score: entry.score,
      breakdown: entry.breakdown
    }));
}
