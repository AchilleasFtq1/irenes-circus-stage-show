import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { validateEvent, handleValidationErrors } from '../middleware/validation';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), validateEvent, handleValidationErrors, createEvent);
router.put('/:id', authenticateToken, requireRole('admin'), validateEvent, handleValidationErrors, updateEvent);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteEvent);

export default router; 