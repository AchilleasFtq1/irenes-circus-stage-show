import React, { useState, useEffect } from 'react';
import { contactAPI } from '@/lib/api';
import { IContact } from '@/lib/types';
import { Mail, Trash2, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminMessages = () => {
  const [messages, setMessages] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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

  const filteredMessages = messages.filter((m) => {
    if (showUnreadOnly && m.isRead) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.subject || '').toLowerCase().includes(q) ||
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q)
    );
  });

  // Ensure latest messages appear first regardless of backend ordering
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-circus text-circus-dark">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Total: {messages.length} • Unread: {unreadCount}</p>
        </div>
        <Button 
          onClick={fetchMessages}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            placeholder="Search by subject, name, email, or message..."
            className="w-full md:flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="h-4 w-4"
            />
            Show unread only
          </label>
        </div>
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
        <div className="bg-white rounded-lg shadow p-2 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4 pr-2">
          {sortedMessages.map((message) => (
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
                  <Button
                    onClick={() => setExpanded(prev => ({ ...prev, [message._id]: !prev[message._id] }))}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    title={expanded[message._id] ? 'Collapse' : 'Expand'}
                  >
                    {expanded[message._id] ? 'Collapse' : 'Expand'}
                  </Button>
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
              
              <p className={`mb-4 whitespace-pre-wrap ${expanded[message._id] ? '' : 'max-h-24 overflow-hidden'}`}>{message.message}</p>
              
              <div className="text-xs text-gray-400">
                Received: {message.createdAt && formatDate(message.createdAt)}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages; 