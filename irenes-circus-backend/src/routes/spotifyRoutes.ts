import { Router, Request, Response, NextFunction } from 'express';
import { getSpotifyToken, testSpotifyAPI } from '../controllers/spotifyController';
import { spotifyLimiter } from '../middleware/security';

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

// Test endpoint with rate limiting
router.get('/', spotifyLimiter, asyncHandler(testSpotifyAPI));

// Get Spotify access token with rate limiting
router.get('/token', spotifyLimiter, asyncHandler(getSpotifyToken));

export default router; 