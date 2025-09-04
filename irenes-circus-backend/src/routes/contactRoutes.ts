import express from 'express';
import { getContacts, getContactById, createContact, markContactAsRead, deleteContact } from '../controllers/contactController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateContact, handleValidationErrors } from '../middleware/validation';
// Rate limiting removed

const router = express.Router();

// Public routes with validation (rate limiting removed)
router.post('/', validateContact, handleValidationErrors, createContact);

// Protected routes (admin only) - rate limiting removed
router.get('/', authenticateToken, requireAdmin, getContacts);
router.get('/:id', authenticateToken, requireAdmin, getContactById);
router.put('/:id/read', authenticateToken, requireAdmin, markContactAsRead);
router.delete('/:id', authenticateToken, requireAdmin, deleteContact);

export default router; 