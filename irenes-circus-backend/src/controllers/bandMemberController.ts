import { Request, Response } from 'express';
import BandMember, { IBandMember } from '../models/BandMember';
import logger from '../config/logger';

// Get all band members
export const getBandMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const bandMembers = await BandMember.find();
    logger.info('All band members retrieved successfully');
    res.status(200).json(bandMembers);
  } catch (error) {
    logger.error('Error retrieving band members:', error);
    res.status(500).json({ message: 'Error retrieving band members', error });
  }
};

// Get a single band member by ID
export const getBandMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const bandMember = await BandMember.findById(req.params.id);
    
    if (!bandMember) {
      logger.warn(`Band member not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Band member not found' });
      return;
    }
    
    logger.info(`Retrieved band member with id: ${req.params.id}`);
    res.status(200).json(bandMember);
  } catch (error) {
    logger.error(`Error retrieving band member with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error retrieving band member', error });
  }
};

// Create a new band member
export const createBandMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const newBandMember: IBandMember = req.body;
    const bandMember = await BandMember.create(newBandMember);
    
    logger.info(`New band member created with id: ${bandMember._id}`);
    res.status(201).json(bandMember);
  } catch (error) {
    logger.error('Error creating band member:', error);
    res.status(500).json({ message: 'Error creating band member', error });
  }
};

// Update a band member
export const updateBandMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedBandMember = await BandMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBandMember) {
      logger.warn(`Band member not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Band member not found' });
      return;
    }
    
    logger.info(`Updated band member with id: ${req.params.id}`);
    res.status(200).json(updatedBandMember);
  } catch (error) {
    logger.error(`Error updating band member with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error updating band member', error });
  }
};

// Delete a band member
export const deleteBandMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedBandMember = await BandMember.findByIdAndDelete(req.params.id);
    
    if (!deletedBandMember) {
      logger.warn(`Band member not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Band member not found' });
      return;
    }
    
    logger.info(`Deleted band member with id: ${req.params.id}`);
    res.status(200).json({ message: 'Band member deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting band member with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error deleting band member', error });
  }
}; 