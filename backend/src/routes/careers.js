import { Router } from "express";
import { z } from "zod";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { validateBody } from "../middleware/validate.js";
import { query } from "../db/pool.js";
import { getMarketStats, normalizeMarketData } from "../services/adzuna.js";
import { getRecommendations } from "../services/recommendations.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const careers = await query(
      `SELECT id, title, description, riasec_code, salary_min, salary_max, demand_level, growth_rate, education_requirements
       FROM careers
       WHERE esco_uri IS NOT NULL OR onet_code IS NOT NULL
       ORDER BY title`
    );
    res.json(careers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [career] = await query(
      `SELECT id, title, description, riasec_code, salary_min, salary_max, demand_level, growth_rate, education_requirements
       FROM careers
       WHERE id = $1`,
      [req.params.id]
    );
    if (!career) {
      res.status(404).json({ error: "Career not found." });
      return;
    }

    const skills = await query(
      `SELECT skills.id, skills.name, skills.category, career_skills.importance_weight
       FROM career_skills
       JOIN skills ON skills.id = career_skills.skill_id
       WHERE career_skills.career_id = $1
       ORDER BY career_skills.importance_weight DESC`,
      [req.params.id]
    );
    res.json({ ...career, skills });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/market", async (req, res, next) => {
  try {
    const [career] = await query(`SELECT title FROM careers WHERE id = $1`, [req.params.id]);
    if (!career) {
      res.status(404).json({ error: "Career not found." });
      return;
    }

    const stats = await getMarketStats(career.title, req.query.region);
    res.json(normalizeMarketData(stats));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/recommendations",
  verifyFirebaseToken,
  async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }
      const [dbUser] = await query(`SELECT id FROM users WHERE firebase_uid = $1`, [user.uid]);
      if (!dbUser) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      const results = await getRecommendations(dbUser.id, 20);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

const saveSchema = z.object({
  career_id: z.string().uuid()
});

router.post(
  "/save",
  verifyFirebaseToken,
  validateBody(saveSchema),
  async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const [dbUser] = await query(`SELECT id FROM users WHERE firebase_uid = $1`, [user.uid]);
      if (!dbUser) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      await query(
        `INSERT INTO saved_careers (user_id, career_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, career_id) DO NOTHING`,
        [dbUser.id, req.body.career_id]
      );

      res.json({ status: "saved" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/saved/list", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const [dbUser] = await query(`SELECT id FROM users WHERE firebase_uid = $1`, [user.uid]);
    if (!dbUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const saved = await query(
      `SELECT careers.id, careers.title, careers.description, saved_careers.saved_at
       FROM saved_careers
       JOIN careers ON careers.id = saved_careers.career_id
       WHERE saved_careers.user_id = $1
       ORDER BY saved_careers.saved_at DESC`,
      [dbUser.id]
    );
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

export default router;
