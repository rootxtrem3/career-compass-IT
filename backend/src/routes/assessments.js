import { Router } from "express";
import { z } from "zod";
import { saveAssessment } from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const assessmentSchema = z.object({
  mbti_result: z.string().length(4).optional(),
  riasec_result: z.string().length(3).optional()
});

router.post("/", verifyFirebaseToken, validateBody(assessmentSchema), async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    await saveAssessment(user.uid, req.body);
    res.json({ status: "saved" });
  } catch (error) {
    next(error);
  }
});

export default router;
