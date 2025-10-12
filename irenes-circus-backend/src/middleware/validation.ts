import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import logger from '../config/logger';

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed:', errors.array());
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  
  next();
};

// Auth validation rules
export const validateRegister: ValidationChain[] = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['admin', 'editor'])
    .withMessage('Role must be either admin or editor')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Track validation rules
export const validateTrack: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Track title is required')
    .isLength({ max: 200 })
    .withMessage('Track title must be less than 200 characters'),
  
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required')
    .matches(/^\d{1,2}:\d{2}$/)
    .withMessage('Duration must be in format MM:SS or M:SS'),
  
  body('audioSrc')
    .trim()
    .notEmpty()
    .withMessage('Audio source is required')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Audio source must be a valid URL'),
  
  body('albumArt')
    .trim()
    .notEmpty()
    .withMessage('Album art is required')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Album art must be a valid URL')
];

// Event validation rules
export const validateEvent: ValidationChain[] = [
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required')
    .isLength({ max: 200 })
    .withMessage('Venue name must be less than 200 characters'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City name must be less than 100 characters'),
  
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country name must be less than 100 characters'),
  
  body('ticketLink')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Ticket link must be a valid URL'),
  
  body('isSoldOut')
    .optional()
    .isBoolean()
    .withMessage('isSoldOut must be a boolean value')
];

// Band member validation rules
export const validateBandMember: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  body('instrument')
    .trim()
    .notEmpty()
    .withMessage('Instrument is required')
    .isLength({ max: 100 })
    .withMessage('Instrument must be less than 100 characters'),
  
  body('bio')
    .trim()
    .notEmpty()
    .withMessage('Bio is required')
    .isLength({ max: 2000 })
    .withMessage('Bio must be less than 2000 characters'),
  
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image is required')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image must be a valid URL')
];

// Gallery image validation rules
export const validateGalleryImage: ValidationChain[] = [
  // Either src (URL) OR data (base64) must be provided
  body('src')
    .optional({ nullable: true })
    .isString()
    .bail()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image source must be a valid URL when provided'),
  body('data')
    .optional({ nullable: true })
    .isString()
    .withMessage('data must be a base64 string when provided'),
  body('mimetype')
    .optional({ nullable: true })
    .isIn(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
    .withMessage('mimetype must be a valid image content type'),
  
  body('alt')
    .trim()
    .notEmpty()
    .withMessage('Alt text is required')
    .isLength({ max: 200 })
    .withMessage('Alt text must be less than 200 characters'),
  
  body('span')
    .optional()
    .isIn(['col', 'row', 'both'])
    .withMessage('Span must be one of: col, row, both')
  ,
  body('eventId')
    .optional()
    .isMongoId()
    .withMessage('eventId must be a valid Mongo ObjectId')
];

// Contact form validation rules
export const validateContact: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject must be less than 200 characters')
    .escape(),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 5000 })
    .withMessage('Message must be less than 5000 characters')
    .escape()
];

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (req: Request, res: Response, next: NextFunction): void => {
  // Basic HTML entity encoding for text fields
  const sanitizeString = (str: string): string => {
    return str.replace(/[<>]/g, '');
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }

  next();
};
