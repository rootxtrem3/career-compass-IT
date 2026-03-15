import { Router } from "express";
import { z } from "zod";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { validateBody } from "../middleware/validate.js";
import { query } from "../db/pool.js";

const router = Router();

const goalSchema = z.object({
  career_id: z.string().uuid()
});

router.post(
  "/goal",
  verifyFirebaseToken,
  validateBody(goalSchema),
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

      await query(`UPDATE users SET career_goal_id = $1 WHERE id = $2`, [
        req.body.career_id,
        dbUser.id
      ]);

      res.json({ status: "updated" });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/untrack", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const [dbUser] = await query(`SELECT id, career_goal_id FROM users WHERE firebase_uid = $1`, [
      user.uid
    ]);
    if (!dbUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (dbUser.career_goal_id) {
      await query(
        `DELETE FROM user_milestones
         WHERE user_id = $1
         AND milestone_id IN (
           SELECT id FROM career_milestones WHERE career_id = $2
         )`,
        [dbUser.id, dbUser.career_goal_id]
      );
    }

    await query(`UPDATE users SET career_goal_id = NULL WHERE id = $1`, [dbUser.id]);

    res.json({ status: "untracked" });
  } catch (error) {
    next(error);
  }
});

const milestoneSchema = z.object({
  milestone_id: z.string().uuid(),
  completed: z.boolean()
});

router.post(
  "/milestone",
  verifyFirebaseToken,
  validateBody(milestoneSchema),
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

      if (req.body.completed) {
        await query(
          `INSERT INTO user_milestones (user_id, milestone_id, completed_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (user_id, milestone_id)
           DO UPDATE SET completed_at = NOW()`,
          [dbUser.id, req.body.milestone_id]
        );
      } else {
        await query(
          `UPDATE user_milestones SET completed_at = NULL
           WHERE user_id = $1 AND milestone_id = $2`,
          [dbUser.id, req.body.milestone_id]
        );
      }

      res.json({ status: "updated" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const [dbUser] = await query(`SELECT id, career_goal_id FROM users WHERE firebase_uid = $1`, [
      user.uid
    ]);
    if (!dbUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (!dbUser.career_goal_id) {
      res.json({ goal: null, milestones: [] });
      return;
    }

    const [goal] = await query(
      `SELECT id, title, description FROM careers WHERE id = $1`,
      [dbUser.career_goal_id]
    );
    const milestones = await query(
      `SELECT career_milestones.id, career_milestones.title, career_milestones.description,
              user_milestones.completed_at
       FROM career_milestones
       LEFT JOIN user_milestones
         ON user_milestones.milestone_id = career_milestones.id
         AND user_milestones.user_id = $1
       WHERE career_milestones.career_id = $2`,
      [dbUser.id, dbUser.career_goal_id]
    );

    res.json({ goal, milestones });
  } catch (error) {
    next(error);
  }
});

export default router;
