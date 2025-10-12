import { Request, Response } from 'express';
import GalleryImage, { IGalleryImage } from '../models/GalleryImage';
import logger from '../config/logger';

// Get all gallery images
export const getGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.query as { eventId?: string };
    const filter = eventId ? { eventId } : {};
    const galleryImages = await GalleryImage.find(filter);
    logger.info('All gallery images retrieved successfully');
    res.status(200).json(galleryImages);
  } catch (error) {
    logger.error('Error retrieving gallery images:', error);
    res.status(500).json({ message: 'Error retrieving gallery images', error });
  }
};

// Get a single gallery image by ID
export const getGalleryImageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryImage = await GalleryImage.findById(req.params.id);
    
    if (!galleryImage) {
      logger.warn(`Gallery image not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Gallery image not found' });
      return;
    }
    
    logger.info(`Retrieved gallery image with id: ${req.params.id}`);
    res.status(200).json(galleryImage);
  } catch (error) {
    logger.error(`Error retrieving gallery image with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error retrieving gallery image', error });
  }
};

// Create a new gallery image
export const createGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const newGalleryImage: IGalleryImage = req.body;
    const galleryImage = await GalleryImage.create(newGalleryImage);
    
    logger.info(`New gallery image created with id: ${galleryImage._id}`);
    res.status(201).json(galleryImage);
  } catch (error) {
    logger.error('Error creating gallery image:', error);
    res.status(500).json({ message: 'Error creating gallery image', error });
  }
};

// Update a gallery image
export const updateGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedGalleryImage = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedGalleryImage) {
      logger.warn(`Gallery image not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Gallery image not found' });
      return;
    }
    
    logger.info(`Updated gallery image with id: ${req.params.id}`);
    res.status(200).json(updatedGalleryImage);
  } catch (error) {
    logger.error(`Error updating gallery image with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error updating gallery image', error });
  }
};

// Delete a gallery image
export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedGalleryImage = await GalleryImage.findByIdAndDelete(req.params.id);
    
    if (!deletedGalleryImage) {
      logger.warn(`Gallery image not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Gallery image not found' });
      return;
    }
    
    logger.info(`Deleted gallery image with id: ${req.params.id}`);
    res.status(200).json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting gallery image with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error deleting gallery image', error });
  }
}; 