import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticateToken, requireRole } from '../middleware/auth';
import validate from '../middleware/validate';
import { eventCreateSchema, eventUpdateSchema } from '../validation/schemas';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), validate(eventCreateSchema), createEvent);
router.put('/:id', authenticateToken, requireRole('admin'), validate(eventUpdateSchema), updateEvent);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteEvent);

export default router; 