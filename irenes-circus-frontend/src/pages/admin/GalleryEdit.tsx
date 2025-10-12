import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { galleryAPI, eventsAPI, uploadAPI } from '@/lib/api';
import { IGalleryImage, SpanType, IEvent } from '@/lib/types';

const GalleryEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [embedInDoc, setEmbedInDoc] = useState<boolean>(false);
  const [data, setData] = useState<string | undefined>(undefined);
  const [mimetype, setMimetype] = useState<string | undefined>(undefined);
  const [span, setSpan] = useState<SpanType | ''>('');
  const [eventId, setEventId] = useState<string>('');
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [image, allEvents] = await Promise.all([
          galleryAPI.getById(id),
          eventsAPI.getAll()
        ]);
        
        if (image) {
          setImageUrl(image.src);
          setData(image.data);
          setMimetype(image.mimetype);
          setTitle(image.alt);
          setSpan(image.span || '');
          setEventId(image.eventId || '');
          setEvents(allEvents);
        } else {
          setError('Image not found');
        }
      } catch (err) {
        console.error('Error fetching gallery image:', err);
        setError('Failed to load gallery image');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      let finalUrl = imageUrl.trim();
      let embeddedData: string | undefined;
      let embeddedMimetype: string | undefined;
      if (file) {
        if (embedInDoc) {
          const fileBuffer = await file.arrayBuffer();
          embeddedData = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
          embeddedMimetype = file.type;
        } else {
          const { url } = await uploadAPI.uploadImage(file);
          finalUrl = url;
        }
      }

      if (!finalUrl && !embeddedData) {
        throw new Error('Please select an image file or provide an image URL');
      }

      await galleryAPI.update(id, {
        src: finalUrl || undefined,
        data: embeddedData,
        mimetype: embeddedMimetype,
        alt: title,
        span: span as SpanType || undefined,
        eventId: eventId || undefined
      });

      navigate('/admin/gallery');
    } catch (err) {
      console.error('Error updating gallery image:', err);
      setError(err instanceof Error ? err.message : 'Failed to update gallery image');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/admin/gallery" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Edit Gallery Image</h1>
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
        <Link to="/admin/gallery" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Edit Gallery Image</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-center">
          {file ? (
            <img 
              src={URL.createObjectURL(file)} 
              alt={title || 'Gallery preview'} 
              className="max-w-full max-h-64 object-contain"
            />
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title || 'Gallery preview'} 
              className="max-w-full max-h-64 object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center p-6">
              <p>No image preview available</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={embedInDoc} onChange={(e) => setEmbedInDoc(e.target.checked)} />
              Store image inside gallery document (no external URL)
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="eventId" className="block text-gray-700 text-sm font-bold mb-2">
              Performance (optional)
            </label>
            <select
              id="eventId"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">No performance</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.date} — {ev.venue}, {ev.city}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Replace Image (upload) or edit URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
              }}
              className="mb-2 block w-full text-sm text-gray-700"
            />
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">If you upload a new file, it will replace the current image URL.</p>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title/Alt Text *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Image description"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="span" className="block text-gray-700 text-sm font-bold mb-2">
              Span Type
            </label>
            <select
              id="span"
              value={span}
              onChange={(e) => setSpan(e.target.value as SpanType | '')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">None</option>
              <option value="col">Column Span</option>
              <option value="row">Row Span</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
            <Link
              to="/admin/gallery"
              className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryEdit;