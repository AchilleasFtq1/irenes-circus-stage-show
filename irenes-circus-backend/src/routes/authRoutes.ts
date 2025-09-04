import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation';
// Rate limiting removed

const router = express.Router();

// Public routes with validation (rate limiting removed)
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router; 