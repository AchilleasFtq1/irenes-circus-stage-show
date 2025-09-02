import React, { useState, useEffect } from 'react';
import { Music, Users, Calendar, Image, MessageSquare, BarChart, PieChart, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bandMembersAPI, eventsAPI, galleryAPI, contactAPI } from '@/lib/api';
import { getArtistTopTracks, getArtistInfo, getArtistAlbums, SpotifyTrack, SpotifyArtist, SpotifyAlbum } from "@/lib/spotify";

interface StatsItemProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  link: string;
}

const StatsItem: React.FC<StatsItemProps> = ({ title, value, icon, bgColor, textColor, link }) => {
  return (
  <Link 
      to={link}
      className={`${bgColor} ${textColor} rounded-lg shadow p-6 hover:shadow-lg transition-shadow`}
  >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="font-medium">{title}</p>
      </div>
        <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </Link>
);
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    galleryImages: 0,
    messages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [artistInfo, setArtistInfo] = useState<SpotifyArtist | null>(null);
  const [spotifyTrackCount, setSpotifyTrackCount] = useState<number>(0);
  const [spotifyAlbums, setSpotifyAlbums] = useState<SpotifyAlbum[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data to get lengths
        const [members, events, images, messages] = await Promise.all([
          bandMembersAPI.getAll(),
          eventsAPI.getAll(),
          galleryAPI.getAll(),
          contactAPI.getAll()
        ]);

        setStats({
          members: members.length,
          events: events.length,
          galleryImages: images.length,
          messages: messages.length
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load some dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSpotifyData = async () => {
      try {
        // Get artist info
        const artistData = await getArtistInfo();
        if (artistData) {
          setArtistInfo(artistData as SpotifyArtist);
        }
        
        // Get top tracks
        const trackData = await getArtistTopTracks();
        if (trackData) {
          setSpotifyTracks(trackData as SpotifyTrack[]);
        }

        // Get all albums to count total tracks
        const albumsData = await getArtistAlbums();
        if (albumsData) {
          setSpotifyAlbums(albumsData as SpotifyAlbum[]);
          
          // Calculate total tracks across all albums
          const totalTracks = albumsData.reduce((sum, album) => sum + ((album as SpotifyAlbum).total_tracks || 0), 0);
          setSpotifyTrackCount(totalTracks);
        }
      } catch (err) {
        console.error("Error fetching Spotify data:", err);
        // We'll just log errors but not break the dashboard
      }
    };

    fetchStats();
    fetchSpotifyData();
  }, []);

  // Format duration from ms to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <StatsItem 
          title="Spotify Tracks"
          value={spotifyTrackCount || 'Loading...'}
          icon={<Music />}
          bgColor="bg-blue-500"
          textColor="text-white"
          link="/admin/tracks"
        />
        <StatsItem 
          title="Band Members"
          value={stats.members}
          icon={<Users />}
          bgColor="bg-pink-500"
          textColor="text-white"
          link="/admin/members"
        />
        <StatsItem 
          title="Events"
          value={stats.events}
          icon={<Calendar />}
          bgColor="bg-purple-500"
          textColor="text-white"
          link="/admin/events"
        />
        <StatsItem 
          title="Gallery Images"
          value={stats.galleryImages}
          icon={<Image />}
          bgColor="bg-green-500"
          textColor="text-white"
          link="/admin/gallery"
        />
        <StatsItem 
          title="Messages"
          value={stats.messages}
          icon={<MessageSquare />}
          bgColor="bg-yellow-500"
          textColor="text-white"
          link="/admin/messages"
        />
      </div>

      {/* Spotify Analytics Section */}
      <h2 className="text-2xl font-bold mb-6 mt-12">Spotify Analytics</h2>
      
      {/* Artist Stats */}
      {artistInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 font-medium mb-2">Followers</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold">
                {artistInfo.followers?.total?.toLocaleString() || 'N/A'}
              </div>
              <div className="ml-4 text-green-500">
                <BarChart size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 font-medium mb-2">Popularity</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{artistInfo.popularity ?? 'N/A'}/100</div>
              <div className="ml-4 text-yellow-500">
                <PieChart size={24} />
              </div>
            </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 font-medium mb-2">Genres</h3>
            <div className="flex items-center">
              <div className="text-xl font-medium">
                {artistInfo.genres?.length > 0 
                  ? artistInfo.genres.slice(0, 2).join(", ") 
                  : "No genres listed"}
              </div>
              <div className="ml-4 text-blue-500">
                <LineChart size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Albums Section */}
      {spotifyAlbums.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Albums</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spotifyAlbums.map((album) => (
              <div key={album.id} className="flex items-start space-x-4">
                <img 
                  src={album.images?.[1]?.url || ''} 
                  alt={album.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{album.name}</h3>
                  <p className="text-sm text-gray-500">
                    {album.album_type?.charAt(0).toUpperCase() + album.album_type?.slice(1) || 'Album'} • {album.release_date?.split('-')[0] || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">{album.total_tracks || 0} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tracks Table */}
      {spotifyTracks.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Top Tracks</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {spotifyTracks.map((track, index) => (
                  <tr key={track.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
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
                            {track.artists?.map((a) => a.name).join(", ")}
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
                              width: `${(track.popularity ?? 0) / 100 * 100}%`,
                              backgroundColor: `hsl(${120 * ((track.popularity ?? 0) / 100)}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {track.popularity ?? 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={track.external_urls?.spotify} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
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

export default AdminDashboard; 