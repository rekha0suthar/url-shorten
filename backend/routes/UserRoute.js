import { Router } from 'express';
import googleLogin from '../controllers/UserController.js';

const router = Router();

// Google Sign-in
router.post('/google', googleLogin);

export default router;
