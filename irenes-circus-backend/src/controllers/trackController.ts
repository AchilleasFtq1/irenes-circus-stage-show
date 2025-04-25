import { Request, Response } from 'express';
import Track, { ITrack } from '../models/Track';
import logger from '../config/logger';

// Get all tracks
export const getTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    logger.info('All tracks retrieved successfully');
    res.status(200).json(tracks);
  } catch (error) {
    logger.error('Error retrieving tracks:', error);
    res.status(500).json({ message: 'Error retrieving tracks', error });
  }
};

// Get a single track by ID
export const getTrackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      logger.warn(`Track not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    
    logger.info(`Retrieved track with id: ${req.params.id}`);
    res.status(200).json(track);
  } catch (error) {
    logger.error(`Error retrieving track with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error retrieving track', error });
  }
};

// Create a new track
export const createTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTrack: ITrack = req.body;
    const track = await Track.create(newTrack);
    
    logger.info(`New track created with id: ${track._id}`);
    res.status(201).json(track);
  } catch (error) {
    logger.error('Error creating track:', error);
    res.status(500).json({ message: 'Error creating track', error });
  }
};

// Update a track
export const updateTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedTrack = await Track.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTrack) {
      logger.warn(`Track not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    
    logger.info(`Updated track with id: ${req.params.id}`);
    res.status(200).json(updatedTrack);
  } catch (error) {
    logger.error(`Error updating track with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error updating track', error });
  }
};

// Delete a track
export const deleteTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedTrack = await Track.findByIdAndDelete(req.params.id);
    
    if (!deletedTrack) {
      logger.warn(`Track not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    
    logger.info(`Deleted track with id: ${req.params.id}`);
    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting track with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error deleting track', error });
  }
}; 