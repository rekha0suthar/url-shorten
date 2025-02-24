import express from 'express';
import { googleLogin, checkAuthStatus } from '../controllers/UserController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/google', googleLogin);

// Protected routes
router.get('/status', authenticateToken, checkAuthStatus);

export default router;
