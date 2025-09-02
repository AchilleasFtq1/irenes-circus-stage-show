import express from 'express';
import { getContacts, getContactById, createContact, markContactAsRead, deleteContact } from '../controllers/contactController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateContact, handleValidationErrors } from '../middleware/validation';
import { contactLimiter, adminLimiter } from '../middleware/security';

const router = express.Router();

// Public routes with validation and rate limiting
router.post('/', contactLimiter, validateContact, handleValidationErrors, createContact);

// Protected routes (admin only)
router.get('/', adminLimiter, authenticateToken, requireAdmin, getContacts);
router.get('/:id', adminLimiter, authenticateToken, requireAdmin, getContactById);
router.put('/:id/read', adminLimiter, authenticateToken, requireAdmin, markContactAsRead);
router.delete('/:id', adminLimiter, authenticateToken, requireAdmin, deleteContact);

export default router; 