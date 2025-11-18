import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon, CalendarIcon } from 'lucide-react';
import { eventAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AdminEventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    budget: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await eventAPI.getAllEvents();
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create an event');
        return;
      }

      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        location: formData.location.trim() || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        userId: userId
      };

      await eventAPI.createEvent(eventData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', startDate: '', endDate: '', location: '', budget: '' });
      loadEvents();
      alert('Event created successfully!');
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.message || 'Failed to create event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    try {
      await eventAPI.deleteEvent(eventId);
      loadEvents();
      alert('Event deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      alert(error.message || 'Failed to delete event. Please try again.');
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Events Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <PlusIcon size={20} />
              <span>Create Event</span>
            </button>
          </div>
        </header>
        <main className="p-8">
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading events...</div>
          ) : (
            <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Event Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Start Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">End Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Budget</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-400">
                        {searchTerm ? 'No events found matching your search' : 'No events found'}
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event: any) => (
                      <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-900 transition-colors">
                        <td className="py-4 px-4 text-white font-medium">{event.name || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-300">{event.location || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(event.startDate)}</td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(event.endDate)}</td>
                        <td className="py-4 px-4 text-gray-300">{formatCurrency(event.budget)}</td>
                        <td className="py-4 px-4 text-gray-300">
                          {event.user?.fullName || event.user?.username || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/admin/events/${event.id}`)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              <CalendarIcon size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete Event"
                            >
                              <TrashIcon size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Event Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Budget</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '', startDate: '', endDate: '', location: '', budget: '' });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
