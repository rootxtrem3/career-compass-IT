import { Router } from "express";
import { z } from "zod";
import {
  clearCareerGoal,
  getProgress,
  setCareerGoal,
  setMilestone
} from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const goalSchema = z.object({
  career_id: z.string().uuid()
});

router.post("/goal", verifyFirebaseToken, validateBody(goalSchema), async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const updated = await setCareerGoal(user.uid, req.body.career_id);
    if (!updated) {
      res.status(404).json({ error: "Career not found." });
      return;
    }

    res.json({ status: "updated" });
  } catch (error) {
    next(error);
  }
});

router.post("/untrack", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    await clearCareerGoal(user.uid);
    res.json({ status: "untracked" });
  } catch (error) {
    next(error);
  }
});

const milestoneSchema = z.object({
  milestone_id: z.string(),
  completed: z.boolean()
});

router.post("/milestone", verifyFirebaseToken, validateBody(milestoneSchema), async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    await setMilestone(user.uid, req.body.milestone_id, req.body.completed);
    res.json({ status: "updated" });
  } catch (error) {
    next(error);
  }
});

router.get("/", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    res.json(await getProgress(user.uid));
  } catch (error) {
    next(error);
  }
});

export default router;
