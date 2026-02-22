import { Router } from 'express';
import { getCareerPaths } from '../controllers/careerController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/paths', asyncHandler(getCareerPaths));

export default router;
