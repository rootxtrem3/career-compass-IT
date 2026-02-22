import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getCurrentUser, loginUser, registerUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/me', asyncHandler(getCurrentUser));

export default router;
