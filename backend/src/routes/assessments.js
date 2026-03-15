import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { query } from "../db/pool.js";

const router = Router();

const assessmentSchema = z.object({
  mbti_result: z.string().length(4).optional(),
  riasec_result: z.string().length(3).optional()
});

router.post(
  "/",
  verifyFirebaseToken,
  validateBody(assessmentSchema),
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

      const { mbti_result, riasec_result } = req.body;
      await query(
        `INSERT INTO assessments (user_id, mbti_result, riasec_result)
         VALUES ($1, $2, $3)`,
        [dbUser.id, mbti_result ?? null, riasec_result ?? null]
      );

      await query(
        `UPDATE users
         SET mbti_type = COALESCE($1, mbti_type),
             riasec_code = COALESCE($2, riasec_code)
         WHERE id = $3`,
        [mbti_result ?? null, riasec_result ?? null, dbUser.id]
      );

      res.json({ status: "saved" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
