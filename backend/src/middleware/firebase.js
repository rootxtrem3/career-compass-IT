import admin from "firebase-admin";
import { config } from "../utils/config.js";

const hasFirebaseAdminCredentials =
  Boolean(config.FIREBASE_PROJECT_ID) &&
  Boolean(config.FIREBASE_CLIENT_EMAIL) &&
  Boolean(config.FIREBASE_PRIVATE_KEY);

if (!config.AUTH_BYPASS && hasFirebaseAdminCredentials && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.FIREBASE_PROJECT_ID,
      clientEmail: config.FIREBASE_CLIENT_EMAIL,
      privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

export async function verifyFirebaseToken(req, res, next) {
  if (config.AUTH_BYPASS || !hasFirebaseAdminCredentials) {
    req.user = { uid: "dev-user", email: "dev@local", name: "Dev User" };
    next();
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing Authorization Bearer token." });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Firebase token." });
  }
}
