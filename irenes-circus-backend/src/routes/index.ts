import express from 'express';
import trackRoutes from './trackRoutes';
import eventRoutes from './eventRoutes';
import bandMemberRoutes from './bandMemberRoutes';
import galleryRoutes from './galleryRoutes';
import contactRoutes from './contactRoutes';
import authRoutes from './authRoutes';
import spotifyRoutes from './spotifyRoutes';
import uploadRoutes from './uploadRoutes';
import logger from '../config/logger';

const router = express.Router();

// API version and health check
router.get('/', (req, res) => {
  logger.info('API health check endpoint accessed');
  res.json({
    message: "Irene's Circus API",
    version: '1.0.0',
    status: 'healthy'
  });
});

// Dedicated health check endpoint for Render
router.get('/health', (req, res) => {
  logger.info('Health check endpoint accessed');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
router.use('/tracks', trackRoutes);
router.use('/events', eventRoutes);
router.use('/band-members', bandMemberRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);
router.use('/auth', authRoutes);
router.use('/spotify', spotifyRoutes);
// Use plural '/uploads' for both POST and GET (/api/uploads and /api/uploads/:filename)
router.use('/uploads', uploadRoutes);

export default router; 