import admin from 'firebase-admin';
import { env } from './env.js';

const hasFirebaseCredentials =
  Boolean(env.FIREBASE_PROJECT_ID) &&
  Boolean(env.FIREBASE_CLIENT_EMAIL) &&
  Boolean(env.FIREBASE_PRIVATE_KEY);

let initialized = false;

if (hasFirebaseCredentials && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
  initialized = true;
}

export function isFirebaseAdminEnabled() {
  return initialized;
}

export async function verifyFirebaseIdToken(token) {
  if (!initialized || !token) {
    return null;
  }

  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    return null;
  }
}
