import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { query } from "../db/pool.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const skills = await query(
      `SELECT id, name, category, difficulty, description FROM skills ORDER BY name`
    );
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

const userSkillsSchema = z.object({
  skills: z.array(
    z.object({
      skill_id: z.string().uuid(),
      level: z.number().min(0).max(4)
    })
  )
});

router.post(
  "/user",
  verifyFirebaseToken,
  validateBody(userSkillsSchema),
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

      for (const entry of req.body.skills) {
        await query(
          `INSERT INTO user_skills (user_id, skill_id, level)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, skill_id) DO UPDATE
           SET level = EXCLUDED.level`,
          [dbUser.id, entry.skill_id, entry.level]
        );
      }

      res.json({ status: "updated" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
