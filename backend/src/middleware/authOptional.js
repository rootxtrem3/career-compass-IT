import { verifyMockToken } from '../utils/jwtMock.js';
import { verifyFirebaseIdToken } from '../config/firebaseAdmin.js';

export function authOptional(req, _res, next) {
  (async () => {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      req.user = null;
      return next();
    }

    const firebasePayload = await verifyFirebaseIdToken(token);
    if (firebasePayload) {
      req.user = {
        sub: firebasePayload.uid,
        email: firebasePayload.email || null,
        role: 'user',
        provider: 'firebase'
      };
      return next();
    }

    const payload = verifyMockToken(token);
    req.user = payload
      ? {
          ...payload,
          provider: 'mock'
        }
      : null;
    return next();
  })().catch(next);
}
