import express from 'express';
import { getGalleryImages, getGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/galleryImageController';
import { authenticateToken, requireRole } from '../middleware/auth';
import validate from '../middleware/validate';
import { galleryImageCreateSchema, galleryImageUpdateSchema } from '../validation/schemas';

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImageById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), validate(galleryImageCreateSchema), createGalleryImage);
router.put('/:id', authenticateToken, requireRole('admin'), validate(galleryImageUpdateSchema), updateGalleryImage);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteGalleryImage);

export default router; 