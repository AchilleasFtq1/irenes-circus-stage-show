import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Play, Pause, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getArtistTopTracks } from '@/lib/spotify';

const AdminTracks: React.FC = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const data = await getArtistTopTracks();
        if (data) {
          setTracks(data);
        } else {
          throw new Error('No track data returned');
        }
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError('Failed to load tracks from Spotify');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    // Cleanup audio on unmount
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, []);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPreview = (trackId: string, previewUrl: string | null) => {
    if (!previewUrl) return;

    if (currentlyPlaying === trackId) {
      // Pause if already playing this track
      if (audioRef) {
        audioRef.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing track
      if (audioRef) {
        audioRef.pause();
      }

      // Play the new track
      const audio = new Audio(previewUrl);
      audio.play();
      setAudioRef(audio);
      setCurrentlyPlaying(trackId);

      // Reset when finished playing
      audio.onended = () => {
        setCurrentlyPlaying(null);
        setAudioRef(null);
      };
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Tracks</h1>
        </div>
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Tracks</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {tracks.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Music size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">No Tracks Found</h2>
          <p className="text-gray-500">No tracks were found on Spotify for this artist.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Tracks</h2>
            <span className="text-sm text-gray-500">{tracks.length} tracks</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Album
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={track.album?.images?.[2]?.url || ''} 
                          alt={track.album?.name}
                          className="h-10 w-10 rounded-sm mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {track.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {track.artists?.map((a: any) => a.name).join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {track.album?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(track.duration_ms)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full"
                            style={{ 
                              width: `${(track.popularity || 0) / 100 * 100}%`,
                              backgroundColor: `hsl(${120 * ((track.popularity || 0) / 100)}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {track.popularity || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {track.preview_url ? (
                        <button
                          onClick={() => handlePlayPreview(track.id, track.preview_url)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          {currentlyPlaying === track.id ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No preview</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={track.external_urls?.spotify} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTracks; 