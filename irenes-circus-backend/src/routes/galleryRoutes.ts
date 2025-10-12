import express from 'express';
import { getGalleryImages, getGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/galleryImageController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateGalleryImage, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImageById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), validateGalleryImage, handleValidationErrors, createGalleryImage);
router.put('/:id', authenticateToken, requireRole('admin'), validateGalleryImage, handleValidationErrors, updateGalleryImage);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteGalleryImage);

export default router; 