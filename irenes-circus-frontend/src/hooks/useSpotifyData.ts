import { useState, useEffect } from 'react';
import { getArtistAlbums, ARTIST_ID } from '@/lib/spotify';

// Types for Spotify objects - matching Spotify Web API types
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  album_type: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
  artists: {
    id: string;
    name: string;
    uri: string;
    href: string;
    external_urls: {
      spotify: string;
    };
  }[];
}

const useSpotifyData = () => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        setLoading(true);
        const artistAlbums = await getArtistAlbums();
        
        if (artistAlbums && artistAlbums.length > 0) {
          // Force the type conversion with an unknown first
          setAlbums(artistAlbums as unknown as SpotifyAlbum[]);
        } else {
          throw new Error('No albums found for this artist');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error in useSpotifyData:', err);
        setError('Could not load Spotify data. Please check your network connection or try again later.');
        // Return empty array, no fallback data
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, []);

  return { albums, loading, error };
};

export default useSpotifyData; 