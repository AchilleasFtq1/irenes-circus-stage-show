import express from 'express';
import { getContacts, getContactById, createContact, markContactAsRead, deleteContact } from '../controllers/contactController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createContact);

// Protected routes (admin only)
router.get('/', authenticateToken, requireRole('admin'), getContacts);
router.get('/:id', authenticateToken, requireRole('admin'), getContactById);
router.put('/:id/read', authenticateToken, requireRole('admin'), markContactAsRead);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteContact);

export default router; 