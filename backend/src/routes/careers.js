import { Router } from "express";
import { z } from "zod";
import {
  getCareer,
  getRecommendations,
  listCareers,
  listSavedCareers,
  saveCareer
} from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listCareers());
  } catch (error) {
    next(error);
  }
});

router.post("/recommendations", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    res.json(await getRecommendations(user.uid, 20));
  } catch (error) {
    next(error);
  }
});

const saveSchema = z.object({
  career_id: z.string().uuid()
});

router.post("/save", verifyFirebaseToken, validateBody(saveSchema), async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    await saveCareer(user.uid, req.body.career_id);
    res.json({ status: "saved" });
  } catch (error) {
    next(error);
  }
});

router.get("/saved/list", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    res.json(await listSavedCareers(user.uid));
  } catch (error) {
    next(error);
  }
});

router.get("/:id/market", async (_req, res) => {
  res.json({
    salary_min: null,
    salary_max: null,
    demand_level: "Unavailable",
    note: "Live market data is disabled while Adzuna integration is removed."
  });
});

router.get("/:id", async (req, res, next) => {
  try {
    const career = await getCareer(req.params.id);
    if (!career) {
      res.status(404).json({ error: "Career not found." });
      return;
    }
    res.json(career);
  } catch (error) {
    next(error);
  }
});

export default router;
