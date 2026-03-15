import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { query } from "../db/pool.js";

const router = Router();

router.get("/me", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const [dbUser] = await query(`SELECT id, email, name, mbti_type, riasec_code FROM users WHERE firebase_uid = $1`, [
      user.uid
    ]);
    if (!dbUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const assessments = await query(
      `SELECT mbti_result, riasec_result, created_at
       FROM assessments
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [dbUser.id]
    );

    const [{ count }] = await query(
      `SELECT COUNT(*)::int AS count FROM saved_careers WHERE user_id = $1`,
      [dbUser.id]
    );

    res.json({
      user: dbUser,
      recent_assessments: assessments,
      saved_count: count
    });
  } catch (error) {
    next(error);
  }
});

export default router;
