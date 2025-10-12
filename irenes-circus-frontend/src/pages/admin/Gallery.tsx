import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { galleryAPI, eventsAPI } from '@/lib/api';
import { IGalleryImage, IEvent } from '@/lib/types';
import GalleryImage from '@/components/GalleryImage';

const AdminGallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<IGalleryImage[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryImages = async (eventId?: string) => {
    try {
      setIsLoading(true);
      const [images, allEvents] = await Promise.all([
        galleryAPI.getAll(eventId ? { eventId } : undefined),
        eventsAPI.getAll()
      ]);
      setGalleryImages(images);
      setEvents(allEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError('Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages(selectedEventId || undefined);
  }, [selectedEventId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await galleryAPI.delete(id);
      fetchGalleryImages();
    } catch (err) {
      console.error('Error deleting gallery image:', err);
      setError('Failed to delete gallery image');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <Link
          to="/admin/gallery/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
        >
          <Plus size={16} className="mr-2" />
          Add Image
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Performance</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="shadow appearance-none border rounded w-full max-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">All performances</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.date} — {ev.venue}, {ev.city}
            </option>
          ))}
        </select>
      </div>

      {galleryImages.length === 0 && !isLoading ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery images found</h3>
          <p className="text-sm text-gray-500 mb-4">Get started by adding your first gallery image.</p>
          <Link
            to="/admin/gallery/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
          >
            <Plus size={16} className="mr-2" />
            Add Image
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {galleryImages.map((image) => (
              <li key={image._id}>
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                      {image.src ? (
                        <GalleryImage
                          src={image.src}
                          alt={image.alt}
                          className="h-full w-full object-cover"
                          fallbackClassName="h-full w-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200">
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {image.alt || 'No title'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {image.span && <span className="mr-3">Span: {image.span}</span>}
                        {image.eventId && (() => {
                          const event = events.find(e => e._id === image.eventId);
                          return event ? (
                            <span className="text-xs">
                              📍 {event.venue}, {event.city}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/gallery/edit/${image._id}`}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;