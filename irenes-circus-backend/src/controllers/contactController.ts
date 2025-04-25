import { Request, Response } from 'express';
import Contact, { IContact } from '../models/Contact';
import logger from '../config/logger';

// Get all contact submissions (for admin)
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    logger.info('All contact messages retrieved successfully');
    res.status(200).json(contacts);
  } catch (error) {
    logger.error('Error retrieving contact messages:', error);
    res.status(500).json({ message: 'Error retrieving contact messages', error });
  }
};

// Get a single contact submission by ID
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      logger.warn(`Contact message not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    
    logger.info(`Retrieved contact message with id: ${req.params.id}`);
    res.status(200).json(contact);
  } catch (error) {
    logger.error(`Error retrieving contact message with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error retrieving contact message', error });
  }
};

// Create a new contact submission
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const newContact: IContact = req.body;
    const contact = await Contact.create(newContact);
    
    logger.info(`New contact message created with id: ${contact._id}`);
    res.status(201).json({ 
      message: 'Your message has been sent successfully!',
      id: contact._id 
    });
  } catch (error) {
    logger.error('Error creating contact message:', error);
    res.status(500).json({ message: 'Error sending your message', error });
  }
};

// Mark a contact as read
export const markContactAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!updatedContact) {
      logger.warn(`Contact message not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    
    logger.info(`Marked contact message as read with id: ${req.params.id}`);
    res.status(200).json(updatedContact);
  } catch (error) {
    logger.error(`Error marking contact message as read with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error marking message as read', error });
  }
};

// Delete a contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      logger.warn(`Contact message not found with id: ${req.params.id}`);
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    
    logger.info(`Deleted contact message with id: ${req.params.id}`);
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting contact message with id: ${req.params.id}`, error);
    res.status(500).json({ message: 'Error deleting contact message', error });
  }
}; 