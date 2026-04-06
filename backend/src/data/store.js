import admin from "firebase-admin";
import { careers, jobs, skills } from "./catalog.js";

const memoryUsers = new Map();
let seedPromise = null;

function nowIso() {
  return new Date().toISOString();
}

function getFirestore() {
  if (!admin.apps.length) return null;
  return admin.firestore();
}

async function upsertCollection(db, collectionName, items) {
  const snapshot = await db.collection(collectionName).limit(1).get();
  if (!snapshot.empty) return;

  let batch = db.batch();
  let count = 0;

  for (const item of items) {
    batch.set(db.collection(collectionName).doc(item.id), item, { merge: true });
    count += 1;

    if (count === 400) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }
}

export async function seedCatalogIfNeeded() {
  const db = getFirestore();
  if (!db) return;
  if (!seedPromise) {
    seedPromise = Promise.all([
      upsertCollection(db, "skills", skills),
      upsertCollection(db, "careers", careers),
      upsertCollection(db, "jobs", jobs)
    ]).catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  await seedPromise;
}

function toUserShape(uid, seed = {}) {
  return {
    uid,
    email: seed.email ?? null,
    name: seed.name ?? "User",
    mbti_type: seed.mbti_type ?? null,
    riasec_code: seed.riasec_code ?? null,
    career_goal_id: seed.career_goal_id ?? null,
    saved_career_ids: seed.saved_career_ids ?? [],
    user_skills: seed.user_skills ?? {},
    assessments: seed.assessments ?? [],
    completed_milestones: seed.completed_milestones ?? {},
    created_at: seed.created_at ?? nowIso(),
    updated_at: nowIso()
  };
}

export async function ensureUser(uid, seed = {}) {
  const db = getFirestore();
  if (!db) {
    const existing = memoryUsers.get(uid);
    const merged = toUserShape(uid, { ...existing, ...seed });
    memoryUsers.set(uid, merged);
    return merged;
  }

  const ref = db.collection("careerCompassUsers").doc(uid);
  const snapshot = await ref.get();
  const merged = toUserShape(uid, { ...(snapshot.exists ? snapshot.data() : {}), ...seed });
  await ref.set(merged, { merge: true });
  return merged;
}

export async function listSkills() {
  const db = getFirestore();
  if (!db) return skills;
  try {
    await seedCatalogIfNeeded();
    const snapshot = await db.collection("skills").orderBy("name").get();
    return snapshot.docs.map((doc) => doc.data());
  } catch {
    return skills;
  }
}

export async function listCareers() {
  const db = getFirestore();
  if (db) {
    try {
      await seedCatalogIfNeeded();
    } catch {
      // Fall back to static catalog data.
    }
  }
  return careers.map(({ skill_weights, milestones, mbti_types, ...career }) => career);
}

export async function getCareer(id) {
  const db = getFirestore();
  if (db) {
    try {
      await seedCatalogIfNeeded();
    } catch {
      // Fall back to static catalog data.
    }
  }
  const career = careers.find((item) => item.id === id);
  if (!career) return null;
  return {
    ...career,
    skills: Object.entries(career.skill_weights).map(([skillId, importance]) => {
      const skill = skills.find((item) => item.id === skillId);
      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        importance_weight: importance
      };
    })
  };
}

export async function saveAssessment(uid, payload) {
  const user = await ensureUser(uid);
  return await ensureUser(uid, {
    ...user,
    mbti_type: payload.mbti_result ?? user.mbti_type ?? null,
    riasec_code: payload.riasec_result ?? user.riasec_code ?? null,
    assessments: [
      {
        mbti_result: payload.mbti_result ?? null,
        riasec_result: payload.riasec_result ?? null,
        created_at: nowIso()
      },
      ...user.assessments
    ].slice(0, 20)
  });
}

export async function setUserSkills(uid, entries) {
  const user = await ensureUser(uid);
  const userSkills = { ...user.user_skills };
  for (const entry of entries) {
    userSkills[entry.skill_id] = entry.level;
  }
  return await ensureUser(uid, { ...user, user_skills: userSkills });
}

function riasecScore(userCode, careerCode) {
  if (!userCode || !careerCode) return 0.3;
  const weights = [0.5, 0.3, 0.2];
  const set = new Set(userCode.split(""));
  return careerCode
    .split("")
    .slice(0, 3)
    .reduce((sum, char, index) => sum + (set.has(char) ? weights[index] : 0), 0);
}

function mbtiScore(userType, careerMbtiTypes) {
  if (!userType) return 0.3;
  return careerMbtiTypes.includes(userType) ? 1 : 0.2;
}

export async function getRecommendations(uid, limit = 20) {
  const user = await ensureUser(uid);
  const db = getFirestore();
  if (db) {
    try {
      await seedCatalogIfNeeded();
    } catch {
      // Fall back to static catalog data.
    }
  }

  return careers
    .map((career) => {
      const required = Object.entries(career.skill_weights);
      const totalWeight = required.reduce((sum, [, weight]) => sum + Number(weight), 0) || 1;
      const weightedSkills = required.reduce((sum, [skillId, weight]) => {
        const level = Number(user.user_skills[skillId] ?? 0);
        return sum + (level / 4) * Number(weight);
      }, 0);
      const skillScore = weightedSkills / totalWeight;
      const coverage =
        required.filter(([skillId]) => Number(user.user_skills[skillId] ?? 0) > 0).length /
        (required.length || 1);
      const riasec = riasecScore(user.riasec_code, career.riasec_code);
      const mbti = mbtiScore(user.mbti_type, career.mbti_types);
      const overall = skillScore * 0.5 + riasec * 0.3 + mbti * 0.2;

      return {
        ...career,
        compatibility_score: Number((overall * 100).toFixed(2)),
        breakdown: {
          skills: Number((skillScore * 100).toFixed(2)),
          coverage: Number((coverage * 100).toFixed(2)),
          riasec: Number((riasec * 100).toFixed(2)),
          mbti: Number((mbti * 100).toFixed(2))
        }
      };
    })
    .sort((a, b) => b.compatibility_score - a.compatibility_score)
    .slice(0, limit)
    .map(({ skill_weights, milestones, mbti_types, ...career }) => career);
}

export async function saveCareer(uid, careerId) {
  const user = await ensureUser(uid);
  const saved = new Set(user.saved_career_ids);
  saved.add(careerId);
  return await ensureUser(uid, { ...user, saved_career_ids: Array.from(saved) });
}

export async function listSavedCareers(uid) {
  const user = await ensureUser(uid);
  return user.saved_career_ids
    .map((careerId) => careers.find((item) => item.id === careerId))
    .filter(Boolean)
    .map(({ skill_weights, milestones, mbti_types, ...career }) => ({
      ...career,
      saved_at: nowIso()
    }));
}

export async function setCareerGoal(uid, careerId) {
  const career = careers.find((item) => item.id === careerId);
  if (!career) return null;
  const user = await ensureUser(uid);
  return await ensureUser(uid, { ...user, career_goal_id: careerId });
}

export async function clearCareerGoal(uid) {
  const user = await ensureUser(uid);
  return await ensureUser(uid, { ...user, career_goal_id: null });
}

export async function getProgress(uid) {
  const user = await ensureUser(uid);
  if (!user.career_goal_id) return { goal: null, milestones: [] };
  const career = careers.find((item) => item.id === user.career_goal_id);
  if (!career) return { goal: null, milestones: [] };

  return {
    goal: {
      id: career.id,
      title: career.title,
      description: career.description
    },
    milestones: career.milestones.map((title, index) => ({
      id: `${career.id}:${index}`,
      title,
      description: "",
      completed_at: user.completed_milestones[`${career.id}:${index}`] ?? null
    }))
  };
}

export async function setMilestone(uid, milestoneId, completed) {
  const user = await ensureUser(uid);
  return await ensureUser(uid, {
    ...user,
    completed_milestones: {
      ...user.completed_milestones,
      [milestoneId]: completed ? nowIso() : null
    }
  });
}

export async function listJobs(limit = 8) {
  const db = getFirestore();
  if (!db) return jobs.slice(0, limit);
  try {
    await seedCatalogIfNeeded();
    const snapshot = await db.collection("jobs").orderBy("posted_at", "desc").limit(limit).get();
    return snapshot.docs.map((doc) => doc.data());
  } catch {
    return jobs.slice(0, limit);
  }
}

export async function syncJobs() {
  return { status: "placeholder", provider: "seed" };
}

export async function trackJob(uid, jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return null;
  const career =
    careers.find((item) => job.title.toLowerCase().includes(item.title.toLowerCase())) ??
    careers.find((item) => item.title.toLowerCase().includes(job.title.toLowerCase()));
  if (!career) return null;
  await setCareerGoal(uid, career.id);
  return career;
}

export async function getUserDashboard(uid) {
  const user = await ensureUser(uid);
  return {
    user: {
      id: user.uid,
      email: user.email,
      name: user.name,
      mbti_type: user.mbti_type,
      riasec_code: user.riasec_code
    },
    recent_assessments: user.assessments.slice(0, 5),
    saved_count: user.saved_career_ids.length
  };
}
