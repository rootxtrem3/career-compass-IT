import { Router } from "express";
import { getUserDashboard } from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";

const router = Router();

router.get("/me", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    res.json(await getUserDashboard(user.uid));
  } catch (error) {
    next(error);
  }
});

export default router;
