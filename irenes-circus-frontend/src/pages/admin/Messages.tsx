import React, { useState, useEffect } from 'react';
import { contactAPI } from '@/lib/api';
import { IContact } from '@/lib/types';
import { Mail, Trash2, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminMessages = () => {
  const [messages, setMessages] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await contactAPI.getAll();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactAPI.markAsRead(id);
      
      // Update the local state to reflect the change
      setMessages(messages.map(message => 
        message._id === id ? { ...message, isRead: true } : message
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to mark message as read.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      await contactAPI.delete(id);
      
      // Remove the message from the local state
      setMessages(messages.filter(message => message._id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-circus text-circus-dark">Contact Messages</h1>
        <Button 
          onClick={fetchMessages}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Mail size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Messages</h2>
          <p className="text-gray-500">There are no contact messages to display.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message._id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                message.isRead ? 'border-gray-300' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-xl font-bold mb-1 ${!message.isRead && 'text-gray-800'}`}>
                    {message.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>From: <span className="font-medium">{message.name}</span></span>
                    <span>•</span>
                    <span>{message.email}</span>
                    {!message.isRead && (
                      <>
                        <span>•</span>
                        <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          New
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!message.isRead && (
                    <Button
                      onClick={() => handleMarkAsRead(message._id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteMessage(message._id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <p className="mb-4 whitespace-pre-wrap">{message.message}</p>
              
              <div className="text-xs text-gray-400">
                Received: {message.createdAt && formatDate(message.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages; 