import { Request, Response } from 'express';
import axios from 'axios';
import logger from '../config/logger';

// Cache for the access token
let spotifyTokenCache: {
  access_token: string;
  expires_at: number; // timestamp when the token expires
} | null = null;

/**
 * Get a Spotify access token
 * This uses the Client Credentials Flow which is simpler but doesn't allow
 * actions on behalf of users
 */
export const getSpotifyToken = async (req: Request, res: Response) => {
  try {
    // Check if we have a valid cached token
    if (spotifyTokenCache && spotifyTokenCache.expires_at > Date.now()) {
      return res.json({ access_token: spotifyTokenCache.access_token });
    }

    // Get credentials from environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      logger.error('Missing Spotify API credentials');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Encode credentials
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Request new token
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data && response.data.access_token) {
      // Calculate expiration time (usually 3600 seconds = 1 hour)
      const expiresIn = response.data.expires_in || 3600;
      
      // Cache the token
      spotifyTokenCache = {
        access_token: response.data.access_token,
        expires_at: Date.now() + (expiresIn * 1000) - 60000, // Subtract 1 minute for safety
      };

      logger.info('New Spotify access token acquired');
      return res.json({ access_token: response.data.access_token });
    } else {
      throw new Error('Invalid response from Spotify API');
    }
  } catch (error: unknown) {
    logger.error('Error getting Spotify token:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      logger.error('Spotify API error details:', error.response.data);
    }
    
    return res.status(500).json({ 
      message: 'Failed to get Spotify access token',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// For testing the API connection
export const testSpotifyAPI = async (req: Request, res: Response) => {
  try {
    return res.json({ 
      message: 'Spotify API endpoint is working',
      note: 'Use /api/spotify/token to get an access token'
    });
  } catch (error: unknown) {
    logger.error('Error in Spotify test endpoint:', error);
    return res.status(500).json({ 
      message: 'Spotify API test failed',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}; 