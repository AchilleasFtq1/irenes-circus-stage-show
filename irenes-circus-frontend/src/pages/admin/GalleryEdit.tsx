import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { galleryAPI } from '@/lib/api';
import { IGalleryImage, SpanType } from '@/lib/types';

const GalleryEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [span, setSpan] = useState<SpanType | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const image = await galleryAPI.getById(id);
        
        if (image) {
          setImageUrl(image.src);
          setTitle(image.alt);
          setSpan(image.span || '');
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
      // Validate form
      if (!imageUrl.trim()) {
        throw new Error('Image URL is required');
      }
      
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      // Update the gallery image
      await galleryAPI.update(id, {
        src: imageUrl,
        alt: title,
        span: span as SpanType || undefined
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
          {imageUrl ? (
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
            <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
              Image URL *
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="https://example.com/image.jpg"
              required
            />
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