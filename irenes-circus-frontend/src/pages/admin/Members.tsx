import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bandMembersAPI } from '@/lib/api';
import { IBandMember } from '@/lib/types';

const AdminMembers: React.FC = () => {
  const [members, setMembers] = useState<IBandMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await bandMembersAPI.getAll();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching band members:', err);
        setError('Failed to load band members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDeleteClick = (memberId: string) => {
    setMemberToDelete(memberId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      await bandMembersAPI.delete(memberToDelete);
      setMembers(members.filter(member => member._id !== memberToDelete));
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (err) {
      console.error('Error deleting band member:', err);
      setError('Failed to delete band member');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Band Members</h1>
        </div>
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Band Members</h1>
        </div>
        <Link 
          to="/admin/band-members/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
        >
          <UserPlus size={16} className="mr-2" />
          Add Member
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {members.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">No Band Members</h2>
          <p className="text-gray-500 mb-4">There are no band members in the database yet.</p>
          <Link 
            to="/admin/band-members/new" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
          >
            <UserPlus size={16} className="mr-2" />
            Add First Member
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-1">{member.name}</h2>
                <p className="text-gray-500 mb-3">{member.instrument}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{member.bio}</p>
                <div className="flex justify-between">
                  <Link
                    to={`/admin/band-members/edit/${member._id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(member._id)}
                    className="inline-flex items-center text-red-600 hover:text-red-900"
                  >
                    <Trash size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this band member? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers; 