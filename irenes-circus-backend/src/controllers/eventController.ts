import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import logger from '../config/logger';

// Get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().sort({ date: 1 });
    logger.info('All events retrieved successfully');
    res.status(200).json(events);
  } catch (error) {
    logger.error('Error retrieving events:', error);
    res.status(500).json({ message: 'Error retrieving events', error });
  }
};

// Get a single event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      logger.warn(`Event not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    logger.info(`Retrieved event with id: ${req.params.id}`);
    res.status(200).json(event);
  } catch (error) {
    logger.error(`Error retrieving event with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error retrieving event', error });
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const newEvent: IEvent = req.body;
    const event = await Event.create(newEvent);
    
    logger.info(`New event created with id: ${event._id}`);
    res.status(201).json(event);
  } catch (error) {
    logger.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      logger.warn(`Event not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    logger.info(`Updated event with id: ${req.params.id}`);
    res.status(200).json(updatedEvent);
  } catch (error) {
    logger.error(`Error updating event with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error updating event', error });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    
    if (!deletedEvent) {
      logger.warn(`Event not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    logger.info(`Deleted event with id: ${req.params.id}`);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting event with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error deleting event', error });
  }
}; 