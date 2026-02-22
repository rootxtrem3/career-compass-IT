import { HttpError } from '../utils/httpError.js';

export function authRequired(req, _res, next) {
  if (!req.user?.sub) {
    throw new HttpError(401, 'Authentication required');
  }
  next();
}
