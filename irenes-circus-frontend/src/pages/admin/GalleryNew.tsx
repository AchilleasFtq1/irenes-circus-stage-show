import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { galleryAPI, eventsAPI, uploadAPI } from '@/lib/api';
import { IEvent, SpanType } from '@/lib/types';

const GalleryNew: React.FC = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [embedInDoc, setEmbedInDoc] = useState<boolean>(true);
  const [span, setSpan] = useState<SpanType | ''>('');
  const [eventId, setEventId] = useState<string>('');
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventsAPI.getAll();
        setEvents(data);
      } catch (e) {
        // Silently ignore for now; events optional
      }
    };
    loadEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      let finalUrl = imageUrl.trim();
      let embeddedData: string | undefined;
      let embeddedMimetype: string | undefined;

      // If a file is selected, upload it to get a URL
      if (file) {
        if (embedInDoc) {
          // Read file as base64
          const fileBuffer = await file.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
          embeddedData = base64;
          embeddedMimetype = file.type;
        } else {
          const { url } = await uploadAPI.uploadImage(file);
          finalUrl = url;
        }
      }

      if (!finalUrl && !embeddedData) {
        throw new Error('Please select an image file or provide an image URL');
      }

      await galleryAPI.create({
        src: finalUrl || undefined,
        data: embeddedData,
        mimetype: embeddedMimetype,
        alt: title,
        span: span as SpanType || undefined,
        eventId: eventId || undefined
      });

      navigate('/admin/gallery');
    } catch (err) {
      console.error('Error creating gallery image:', err);
      setError(err instanceof Error ? err.message : 'Failed to create gallery image');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/admin/gallery" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Add New Gallery Image</h1>
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
              <Upload size={48} className="mx-auto mb-2" />
              <p>Image preview will appear here</p>
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
              Image Upload or URL
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
            <p className="text-xs text-gray-500 mt-1">Choose a file or paste an image URL. File takes priority.</p>
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
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Create Image
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

export default GalleryNew; 