import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { bandMembersAPI } from '@/lib/api';
import { IBandMember } from '@/lib/types';

const MemberNew: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [instrument, setInstrument] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      
      if (!instrument.trim()) {
        throw new Error('Instrument is required');
      }

      if (!bio.trim()) {
        throw new Error('Bio is required');
      }

      if (!image.trim()) {
        throw new Error('Image URL is required');
      }

      // Create the new band member
      await bandMembersAPI.create({
        name,
        instrument,
        bio,
        image
      });

      navigate('/admin/band-members');
    } catch (err) {
      console.error('Error creating band member:', err);
      setError(err instanceof Error ? err.message : 'Failed to create band member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/admin/band-members" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Add New Band Member</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              alt={name || 'Band member preview'} 
              className="max-w-full max-h-64 object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center p-6">
              <p>Image preview will appear here</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="instrument" className="block text-gray-700 text-sm font-bold mb-2">
              Instrument *
            </label>
            <input
              type="text"
              id="instrument"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Lead Vocalist"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Image URL *
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
              Bio *
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Write a brief biography..."
              rows={4}
              required
            ></textarea>
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
                  Save Member
                </>
              )}
            </button>
            <Link
              to="/admin/band-members"
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

export default MemberNew; 