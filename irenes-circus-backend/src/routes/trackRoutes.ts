import express from 'express';
import { getTracks, getTrackById, createTrack, updateTrack, deleteTrack } from '../controllers/trackController';
import { authenticateToken, requireEditor } from '../middleware/auth';
import { validateTrack, handleValidationErrors } from '../middleware/validation';
// Rate limiting removed

const router = express.Router();

// Public routes
router.get('/', getTracks);
router.get('/:id', getTrackById);

// Protected routes (editor/admin only) - rate limiting removed
router.post('/', authenticateToken, requireEditor, validateTrack, handleValidationErrors, createTrack);
router.put('/:id', authenticateToken, requireEditor, validateTrack, handleValidationErrors, updateTrack);
router.delete('/:id', authenticateToken, requireEditor, deleteTrack);

export default router; 