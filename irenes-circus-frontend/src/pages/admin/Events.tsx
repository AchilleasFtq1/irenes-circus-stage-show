import React, { useState, useEffect } from 'react';
import { eventsAPI } from '@/lib/api';
import { IEvent } from '@/lib/types';
import { Calendar, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface EventFormData {
  _id?: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketLink: string;
  isSoldOut: boolean;
}

const initialFormData: EventFormData = {
  date: '',
  venue: '',
  city: '',
  country: '',
  ticketLink: '',
  isSoldOut: false,
};

const AdminEvents = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsAPI.getAll();
      
      // Sort events by date
      const sortedEvents = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setEvents(sortedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setShowForm(false);
    setFormError(null);
  };

  const validateForm = () => {
    if (!formData.date || !formData.venue || !formData.city || !formData.country) {
      setFormError('Please fill out all required fields.');
      return false;
    }
    
    // Check if date is valid
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.date)) {
      setFormError('Please enter a valid date in the format YYYY-MM-DD.');
      return false;
    }
    
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setFormSubmitting(true);
      
      if (isEditing && formData._id) {
        // Update existing event
        await eventsAPI.update(formData._id, formData);
      } else {
        // Create new event
        await eventsAPI.create(formData);
      }
      
      // Refresh the event list
      await fetchEvents();
      resetForm();
    } catch (err) {
      console.error('Error saving event:', err);
      setFormError('Failed to save event. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditEvent = (event: IEvent) => {
    setFormData({
      _id: event._id,
      date: event.date.split('T')[0], // Extract just the date part
      venue: event.venue,
      city: event.city,
      country: event.country,
      ticketLink: event.ticketLink || '',
      isSoldOut: event.isSoldOut || false,
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      await eventsAPI.delete(id);
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-circus text-circus-dark">Manage Events</h1>
        <div className="flex gap-2">
          <Button 
            onClick={fetchEvents}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button 
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : <><Plus size={16} /> Add Event</>}
          </Button>
        </div>
      </div>
      
      {/* Form for adding/editing events */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-circus text-circus-dark mb-4">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          {formError && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1" htmlFor="date">
                  Date*
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  disabled={formSubmitting}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1" htmlFor="venue">
                  Venue*
                </label>
                <Input
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  disabled={formSubmitting}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1" htmlFor="city">
                  City*
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={formSubmitting}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1" htmlFor="country">
                  Country*
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  disabled={formSubmitting}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1" htmlFor="ticketLink">
                  Ticket Link
                </label>
                <Input
                  id="ticketLink"
                  name="ticketLink"
                  type="url"
                  value={formData.ticketLink}
                  onChange={handleInputChange}
                  disabled={formSubmitting}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox
                  id="isSoldOut"
                  name="isSoldOut"
                  checked={formData.isSoldOut}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, isSoldOut: checked === true})}
                  disabled={formSubmitting}
                />
                <label
                  htmlFor="isSoldOut"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Event is sold out
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Saving...' : isEditing ? 'Update Event' : 'Add Event'}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Events</h2>
          <p className="text-gray-500">There are no events to display. Click the "Add Event" button to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event._id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={18} className="text-gray-600" />
                    <span className="font-bold">{formatDate(event.date)}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    {event.venue}
                  </h2>
                  <div className="text-sm text-gray-500 mb-2">
                    {event.city}, {event.country}
                  </div>
                  
                  {event.ticketLink && (
                    <a 
                      href={event.ticketLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Ticket Link
                    </a>
                  )}
                  
                  {event.isSoldOut && (
                    <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      Sold Out
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditEvent(event)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    title="Edit event"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(event._id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents; 