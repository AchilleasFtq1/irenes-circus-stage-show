import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), createEvent);
router.put('/:id', authenticateToken, requireRole('admin'), updateEvent);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteEvent);

export default router; 