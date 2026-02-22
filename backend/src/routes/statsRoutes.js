import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getWorldCareerStats } from '../controllers/statsController.js';

const router = Router();

router.get('/world', asyncHandler(getWorldCareerStats));

export default router;
