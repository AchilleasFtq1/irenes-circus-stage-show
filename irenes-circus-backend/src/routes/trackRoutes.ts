import express from 'express';
import { getTracks, getTrackById, createTrack, updateTrack, deleteTrack } from '../controllers/trackController';
import { authenticateToken, requireRole } from '../middleware/auth';
import validate from '../middleware/validate';
import { trackCreateSchema, trackUpdateSchema } from '../validation/schemas';

const router = express.Router();

// Public routes
router.get('/', getTracks);
router.get('/:id', getTrackById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), validate(trackCreateSchema), createTrack);
router.put('/:id', authenticateToken, requireRole('admin'), validate(trackUpdateSchema), updateTrack);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteTrack);

export default router; 