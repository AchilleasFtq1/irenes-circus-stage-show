import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation';
import { authLimiter } from '../middleware/security';

const router = express.Router();

// Public routes with validation and rate limiting
router.post('/register', authLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router; 