import express from 'express';
import { getContacts, getContactById, createContact, markContactAsRead, deleteContact } from '../controllers/contactController';
import { authenticateToken, requireRole } from '../middleware/auth';
import validate from '../middleware/validate';
import { contactCreateSchema } from '../validation/schemas';

const router = express.Router();

// Public routes
router.post('/', validate(contactCreateSchema), createContact);

// Protected routes (admin only)
router.get('/', authenticateToken, requireRole('admin'), getContacts);
router.get('/:id', authenticateToken, requireRole('admin'), getContactById);
router.put('/:id/read', authenticateToken, requireRole('admin'), markContactAsRead);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteContact);

export default router; 