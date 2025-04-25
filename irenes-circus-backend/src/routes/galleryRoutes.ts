import express from 'express';
import { getGalleryImages, getGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/galleryImageController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImageById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), createGalleryImage);
router.put('/:id', authenticateToken, requireRole('admin'), updateGalleryImage);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteGalleryImage);

export default router; 