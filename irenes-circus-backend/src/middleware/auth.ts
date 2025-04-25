import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Extend the Request interface to include the userId property
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      logger.warn('Authentication failed: No token provided');
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    try {
      // In a real app, verify with JWT
      // For this simple example, we'll decode the base64 token
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      if (!decoded.userId || !decoded.timestamp) {
        throw new Error('Invalid token format');
      }
      
      // Add userId to request object for use in route handlers
      req.userId = decoded.userId;
      
      next();
    } catch (error) {
      logger.warn('Authentication failed: Invalid token', error);
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    logger.error('Error in authentication middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const requireRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore - userId is added by auth middleware
      const userId = req.userId;
      
      if (!userId) {
        logger.warn('Authorization failed: No user ID in request');
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      // In a real app, fetch the user from the database
      // For this example, we'll just check a sample user
      const user = { role: 'admin' }; // Mock user - replace with database lookup
      
      if (user.role !== role) {
        logger.warn(`Authorization failed: User does not have ${role} role`);
        res.status(403).json({ message: 'Insufficient permissions' });
        return;
      }
      
      next();
    } catch (error) {
      logger.error('Error in authorization middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}; 