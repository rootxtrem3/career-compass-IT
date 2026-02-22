import { Router } from 'express';
import { getRecommendations } from '../controllers/analysisController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/recommendations', asyncHandler(getRecommendations));

export default router;
