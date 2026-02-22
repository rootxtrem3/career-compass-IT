import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import lookupRoutes from './lookupRoutes.js';
import statsRoutes from './statsRoutes.js';
import analysisRoutes from './analysisRoutes.js';
import jobsRoutes from './jobsRoutes.js';
import authRoutes from './authRoutes.js';
import careerRoutes from './careerRoutes.js';
import trackingRoutes from './trackingRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/lookups', lookupRoutes);
router.use('/stats', statsRoutes);
router.use('/analysis', analysisRoutes);
router.use('/jobs', jobsRoutes);
router.use('/auth', authRoutes);
router.use('/careers', careerRoutes);
router.use('/tracking', trackingRoutes);

export default router;
