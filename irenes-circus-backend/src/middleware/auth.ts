import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../config/logger';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

// JWT token verification middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Authentication failed: No token provided');
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    let payload: any;
    
    try {
      payload = jwt.verify(token, secret) as any;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn('Authentication failed: Token expired');
        res.status(401).json({ message: 'Token expired' });
        return;
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Authentication failed: Invalid token');
        res.status(401).json({ message: 'Invalid token' });
        return;
      } else {
        throw error;
      }
    }

    // Verify user exists
    const user = await User.findById(payload.userId);
    if (!user) {
      logger.warn(`Authentication failed: User not found for token ${payload.userId}`);
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Add user info to request object
    req.userId = payload.userId;
    req.user = user;
    
    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Role-based authorization middleware
export const requireRole = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      
      if (!user) {
        logger.warn('Authorization failed: No user in request');
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      if (user.role !== requiredRole && user.role !== 'admin') {
        logger.warn(`Authorization failed: User does not have ${requiredRole} role`);
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

// Admin-only middleware
export const requireAdmin = requireRole('admin');

// Editor or Admin middleware
export const requireEditor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      logger.warn('Authorization failed: No user in request');
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    if (user.role !== 'editor' && user.role !== 'admin') {
      logger.warn(`Authorization failed: User does not have editor or admin role`);
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    
    next();
  } catch (error) {
    logger.error('Error in authorization middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};