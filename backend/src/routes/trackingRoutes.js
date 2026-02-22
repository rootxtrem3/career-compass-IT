import { Router } from 'express';
import {
  getChecklistItems,
  getMyHistory,
  patchChecklistItem,
  postChecklistBootstrap
} from '../controllers/trackingController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authRequired } from '../middleware/authRequired.js';

const router = Router();

router.use(authRequired);

router.get('/history', asyncHandler(getMyHistory));
router.get('/checklist', asyncHandler(getChecklistItems));
router.post('/checklist/bootstrap', asyncHandler(postChecklistBootstrap));
router.patch('/checklist/:itemId', asyncHandler(patchChecklistItem));

export default router;
