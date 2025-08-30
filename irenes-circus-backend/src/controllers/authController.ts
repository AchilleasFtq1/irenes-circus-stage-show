import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import logger from '../config/logger';

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  const payload = { 
    userId, 
    role,
    iat: Math.floor(Date.now() / 1000)
  };
  
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  return jwt.sign(payload, secret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  });
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed: Email ${email} already in use`);
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'editor'
    });
    
    // Generate token for the new user
    const token = generateToken(user._id.toString(), user.role);
    
    logger.info(`New user registered: ${username} (${email})`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// User login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: No user found with email ${email}`);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for ${email}`);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Generate token
    const token = generateToken(user._id.toString(), user.role);
    
    logger.info(`User logged in: ${user.username} (${email})`);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - userId is added by auth middleware
    const userId = req.userId;
    
    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      logger.warn(`No user found with id ${userId}`);
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    logger.info(`Retrieved current user: ${user.username}`);
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Error retrieving current user:', error);
    res.status(500).json({ message: 'Error retrieving user data', error });
  }
}; 