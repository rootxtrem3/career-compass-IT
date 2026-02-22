import { Router } from 'express';
import { getLookups } from '../controllers/lookupController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getLookups));

export default router;
