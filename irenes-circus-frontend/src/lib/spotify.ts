import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// The artist ID for Irene's Circus
export const ARTIST_ID = '25XfQgnvMcoCvcfNqU69ZG';

// API BASE URL for our backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Fetch a fresh access token from our backend
 * The backend handles Spotify auth and token refreshing
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE}/spotify/token`);
    
    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.access_token) {
      // Set the token for all future Spotify API calls
      spotifyApi.setAccessToken(data.access_token);
      return data.access_token;
    }
    
    throw new Error('No access token received from API');
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return null;
  }
};

// Types for Spotify API responses
export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  type: string;
  album_type: string;
  release_date?: string;
  total_tracks?: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  followers?: {
    total: number;
  };
  genres?: string[];
  popularity?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: {
    id: string;
    name: string;
  }[];
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  popularity?: number;
  preview_url?: string;
}

// Fetch artist info
export const getArtistInfo = async () => {
  try {
    // Get a fresh token before making the request
    await getAccessToken();
    return await spotifyApi.getArtist(ARTIST_ID);
  } catch (error) {
    console.error('Error fetching artist info:', error);
    return null;
  }
};

// Fetch artist's albums
export const getArtistAlbums = async () => {
  try {
    // Get a fresh token before making the request
    await getAccessToken();
    const response = await spotifyApi.getArtistAlbums(ARTIST_ID, { limit: 10 });
    return response.items;
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    return [];
  }
};

// Fetch artist's top tracks
export const getArtistTopTracks = async (country = 'US') => {
  try {
    // Get a fresh token before making the request
    await getAccessToken();
    const response = await spotifyApi.getArtistTopTracks(ARTIST_ID, country);
    return response.tracks;
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    return [];
  }
};

// Manual token setter - mostly for development purposes
export const setAccessToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};

export default spotifyApi; 