import { Router } from 'express';
import { getJobs, syncJobs } from '../controllers/jobsController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getJobs));
router.post('/sync', asyncHandler(syncJobs));

export default router;
