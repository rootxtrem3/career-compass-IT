import { Router } from "express";
import admin from "firebase-admin";
import { verifyFirebaseToken } from "../middleware/firebase.js";
import { query } from "../db/pool.js";

const router = Router();

router.post("/sync", verifyFirebaseToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const email = user.email ?? "unknown";
    const name = user.name ?? user.email ?? "User";

    const existing = await query(`SELECT id FROM users WHERE firebase_uid = $1`, [user.uid]);

    if (existing.length === 0) {
      const [created] = await query(
        `INSERT INTO users (firebase_uid, email, name)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [user.uid, email, name]
      );
      await upsertFirestoreUser(user);
      res.json({ id: created.id, firebase_uid: user.uid, email, name });
      return;
    }

    await upsertFirestoreUser(user);
    res.json({ id: existing[0].id, firebase_uid: user.uid, email, name });
  } catch (error) {
    next(error);
  }
});

async function upsertFirestoreUser(decodedToken) {
  if (!admin.apps.length) return;
  const db = admin.firestore();
  const now = new Date().toISOString();
  const userRef = db.collection("users").doc(decodedToken.uid);

  await userRef.set(
    {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      name: decodedToken.name ?? null,
      lastLoginAt: now,
      authTime: decodedToken.auth_time ?? null,
      tokenIssuedAt: decodedToken.iat ?? null,
      tokenExpiresAt: decodedToken.exp ?? null
    },
    { merge: true }
  );

  if (decodedToken.iat) {
    const sessionId = `${decodedToken.uid}-${decodedToken.iat}`;
    await userRef
      .collection("sessions")
      .doc(sessionId)
      .set(
        {
          issuedAt: decodedToken.iat,
          expiresAt: decodedToken.exp ?? null,
          lastSeenAt: now,
          provider: decodedToken.firebase?.sign_in_provider ?? "unknown"
        },
        { merge: true }
      );
  }
}

export default router;
