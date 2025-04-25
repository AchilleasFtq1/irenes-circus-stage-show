import { Router, Request, Response, NextFunction } from 'express';
import { getSpotifyToken, testSpotifyAPI } from '../controllers/spotifyController';

const router = Router();

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncHandler) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Test endpoint
router.get('/', asyncHandler(testSpotifyAPI));

// Get Spotify access token
router.get('/token', asyncHandler(getSpotifyToken));

export default router; 