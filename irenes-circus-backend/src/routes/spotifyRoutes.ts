import { Router, Request, Response, NextFunction } from 'express';
import { getSpotifyToken, testSpotifyAPI } from '../controllers/spotifyController';
// Rate limiting removed

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

// Test endpoint (rate limiting removed)
router.get('/', asyncHandler(testSpotifyAPI));

// Get Spotify access token (rate limiting removed)
router.get('/token', asyncHandler(getSpotifyToken));

export default router; 