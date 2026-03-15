import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { query } from "../db/pool.js";
import { syncLatestJobs } from "../services/adzuna_jobs.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 8);
    const jobs = await query(
      `SELECT id, source, external_id, title, company, location, posted_at, apply_url
       FROM jobs
       ORDER BY posted_at DESC NULLS LAST, created_at DESC
       LIMIT $1`,
      [limit]
    );
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

router.post("/sync", verifyFirebaseToken, async (_req, res, next) => {
  try {
    await syncLatestJobs();
    res.json({ status: "synced" });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/track", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const [job] = await query(
      `SELECT id, title FROM jobs WHERE id = $1`,
      [req.params.id]
    );
    if (!job) {
      res.status(404).json({ error: "Job not found." });
      return;
    }

    const [career] = await query(
      `SELECT id, title FROM careers
       WHERE $1 ILIKE '%' || title || '%'
          OR title ILIKE '%' || $1 || '%'
       ORDER BY LENGTH(title) DESC
       LIMIT 1`,
      [job.title]
    );
    if (!career) {
      res.status(404).json({ error: "No matching career found." });
      return;
    }

    const [dbUser] = await query(
      `SELECT id FROM users WHERE firebase_uid = $1`,
      [user.uid]
    );
    if (!dbUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    await query(`UPDATE users SET career_goal_id = $1 WHERE id = $2`, [career.id, dbUser.id]);

    res.json({ status: "tracked", career_id: career.id, career_title: career.title });
  } catch (error) {
    next(error);
  }
});

export default router;
