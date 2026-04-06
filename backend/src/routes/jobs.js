import { Router } from "express";
import { listJobs, syncJobs, trackJob } from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 8);
    res.json(await listJobs(limit));
  } catch (error) {
    next(error);
  }
});

router.post("/sync", verifyFirebaseToken, async (_req, res, next) => {
  try {
    res.json(await syncJobs());
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

    const career = await trackJob(user.uid, req.params.id);
    if (!career) {
      res.status(404).json({ error: "No matching career found." });
      return;
    }

    res.json({ status: "tracked", career_id: career.id, career_title: career.title });
  } catch (error) {
    next(error);
  }
});

export default router;
