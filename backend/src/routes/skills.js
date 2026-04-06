import { Router } from "express";
import { z } from "zod";
import { listSkills, setUserSkills } from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listSkills());
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

router.post("/user", verifyFirebaseToken, validateBody(userSkillsSchema), async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    await setUserSkills(user.uid, req.body.skills);
    res.json({ status: "updated" });
  } catch (error) {
    next(error);
  }
});

export default router;
