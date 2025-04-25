import express from 'express';
import { getTracks, getTrackById, createTrack, updateTrack, deleteTrack } from '../controllers/trackController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTracks);
router.get('/:id', getTrackById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), createTrack);
router.put('/:id', authenticateToken, requireRole('admin'), updateTrack);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteTrack);

export default router; 