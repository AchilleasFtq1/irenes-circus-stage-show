import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { eventsAPI } from '@/lib/api';
import { IEvent } from '@/lib/types';
import { Calendar, Plus, RefreshCw, MapPin, Ticket, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '@/components/DataTable';
import SearchFilter, { FilterOption, SortOption } from '@/components/SearchFilter';
import { InputField, CheckboxField, FormActions, FormSection } from '@/components/FormField';
import { useToast } from '@/hooks/useToast';
import { usePagination } from '@/components/Pagination';
import Pagination from '@/components/Pagination';

// Validation schema
const eventSchema = z.object({
  date: z.string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  venue: z.string()
    .min(2, "Venue must be at least 2 characters")
    .max(200, "Venue must be less than 200 characters"),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  country: z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters"),
  ticketLink: z.string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  isSoldOut: z.boolean().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const AdminEventsImproved = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  
  const { success, error: showError } = useToast();
  
  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData,
    setCurrentPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredEvents, 10);

  // Form handling
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  // Fetch events
  const fetchEvents = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await eventsAPI.getAll();
      
      // Sort events by date
      const sortedEvents = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setEvents(sortedEvents);
      setError(null);
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Table columns
  const columns: Column<IEvent>[] = [
    {
      key: 'date',
      title: 'Date',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString(),
      width: '120px',
    },
    {
      key: 'venue',
      title: 'Venue',
      sortable: true,
    },
    {
      key: 'city',
      title: 'Location',
      render: (city, event) => `${city}, ${event.country}`,
    },
    {
      key: 'isSoldOut',
      title: 'Status',
      render: (isSoldOut, event) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isSoldOut 
            ? 'bg-red-100 text-red-800' 
            : event.ticketLink 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
        }`}>
          {isSoldOut ? 'Sold Out' : event.ticketLink ? 'Available' : 'Coming Soon'}
        </span>
      ),
      width: '120px',
    },
    {
      key: 'ticketLink',
      title: 'Tickets',
      render: (ticketLink) => ticketLink ? (
        <a 
          href={ticketLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ) : (
        <span className="text-gray-400">N/A</span>
      ),
      width: '100px',
    },
  ];

  // Filter options
  const filterOptions = [
    {
      field: 'country' as keyof IEvent,
      options: Array.from(new Set(events.map(e => e.country))).map(country => ({
        label: country,
        value: country,
      })),
      placeholder: 'Filter by Country',
    },
    {
      field: 'isSoldOut' as keyof IEvent,
      options: [
        { label: 'Available', value: 'false' },
        { label: 'Sold Out', value: 'true' },
      ],
      placeholder: 'Filter by Status',
    },
  ];

  // Sort options
  const sortOptions = {
    field: 'date' as keyof IEvent,
    options: [
      { label: 'Date', value: 'date', direction: 'asc' as const },
      { label: 'Venue', value: 'venue', direction: 'asc' as const },
      { label: 'City', value: 'city', direction: 'asc' as const },
    ],
  };

  // Form handlers
  const handleEdit = (event: IEvent) => {
    setEditingEvent(event);
    setValue('date', event.date.split('T')[0]);
    setValue('venue', event.venue);
    setValue('city', event.city);
    setValue('country', event.country);
    setValue('ticketLink', event.ticketLink || '');
    setValue('isSoldOut', event.isSoldOut || false);
    setShowForm(true);
  };

  const handleDelete = async (event: IEvent) => {
    try {
      await eventsAPI.delete(event._id);
      setEvents(events.filter(e => e._id !== event._id));
      success(`Event "${event.venue}" deleted successfully`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      showError(errorMessage);
    }
  };

  const handleSubmit = async (data: EventFormData) => {
    try {
      if (editingEvent) {
        await eventsAPI.update(editingEvent._id, data);
        success('Event updated successfully');
      } else {
        await eventsAPI.create(data);
        success('Event created successfully');
      }
      
      await fetchEvents();
      handleCancel();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save event';
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Events Management
          </h1>
          <p className="text-gray-600 mt-1">Manage tour dates and venue information</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchEvents}
            disabled={isLoading}
            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          <form onSubmit={handleSubmit(handleSubmit)} className="space-y-6">
            <FormSection title="Event Details" description="Basic information about the event">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="date"
                  label="Date"
                  type="date"
                  register={register}
                  error={errors.date}
                  disabled={isSubmitting}
                  required
                  icon={<Calendar size={16} />}
                />

                <InputField
                  name="venue"
                  label="Venue"
                  register={register}
                  error={errors.venue}
                  disabled={isSubmitting}
                  required
                  icon={<MapPin size={16} />}
                  placeholder="e.g., Madison Square Garden"
                />

                <InputField
                  name="city"
                  label="City"
                  register={register}
                  error={errors.city}
                  disabled={isSubmitting}
                  required
                  placeholder="e.g., New York"
                />

                <InputField
                  name="country"
                  label="Country"
                  register={register}
                  error={errors.country}
                  disabled={isSubmitting}
                  required
                  placeholder="e.g., USA"
                />
              </div>
            </FormSection>

            <FormSection title="Ticketing" description="Ticket information and availability">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="ticketLink"
                  label="Ticket Link"
                  type="url"
                  register={register}
                  error={errors.ticketLink}
                  disabled={isSubmitting}
                  icon={<Ticket size={16} />}
                  placeholder="https://tickets.example.com"
                  helpText="Optional: Link to ticket purchasing page"
                />

                <CheckboxField
                  name="isSoldOut"
                  label="Sold Out"
                  register={register}
                  error={errors.isSoldOut}
                  disabled={isSubmitting}
                  description="Check if this event is sold out"
                />
              </div>
            </FormSection>

            <FormActions
              isSubmitting={isSubmitting}
              submitLabel={editingEvent ? 'Update Event' : 'Create Event'}
              onCancel={handleCancel}
            />
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <SearchFilter
        data={events}
        onFilteredData={setFilteredEvents}
        searchFields={['venue', 'city', 'country']}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        placeholder="Search events by venue, city, or country..."
      />

      {/* Events Table */}
      <DataTable
        data={paginatedData}
        columns={columns}
        loading={isLoading}
        emptyMessage="No events found. Create your first event to get started!"
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteConfirmation={{
          title: "Delete Event",
          description: "Are you sure you want to delete this event? This action cannot be undone."
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default AdminEventsImproved;
