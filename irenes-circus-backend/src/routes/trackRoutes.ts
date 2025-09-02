import express from 'express';
import { getTracks, getTrackById, createTrack, updateTrack, deleteTrack } from '../controllers/trackController';
import { authenticateToken, requireEditor } from '../middleware/auth';
import { validateTrack, handleValidationErrors } from '../middleware/validation';
import { adminLimiter } from '../middleware/security';

const router = express.Router();

// Public routes
router.get('/', getTracks);
router.get('/:id', getTrackById);

// Protected routes (editor/admin only)
router.post('/', adminLimiter, authenticateToken, requireEditor, validateTrack, handleValidationErrors, createTrack);
router.put('/:id', adminLimiter, authenticateToken, requireEditor, validateTrack, handleValidationErrors, updateTrack);
router.delete('/:id', adminLimiter, authenticateToken, requireEditor, deleteTrack);

export default router; 