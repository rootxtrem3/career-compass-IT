import { Router } from "express";
import { ensureUser } from "../data/store.js";
import { verifyFirebaseToken } from "../middleware/firebase.js";

const router = Router();

router.post("/sync", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const record = await ensureUser(user.uid, {
      email: user.email ?? "unknown",
      name: user.name ?? user.email ?? "User"
    });

    res.json({
      id: record.uid,
      firebase_uid: record.uid,
      email: record.email,
      name: record.name
    });
  } catch (error) {
    next(error);
  }
});

export default router;
