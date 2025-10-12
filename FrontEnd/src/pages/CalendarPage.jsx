import React, { useState, useEffect } from 'react';
import { calendarAPI, userAPI, eventAPI, auth } from '../services/api';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import CalendarView from '../components/CalendarView';
import { Plus, Calendar, Clock, User, Eye } from 'lucide-react';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [formData, setFormData] = useState({
    userId: '',
    eventTitle: '',
    eventDate: ''
  });

  useEffect(() => {
    const u = auth.getUser();
    const id = u && (u.id || u._id);
    if (id) {
      setSelectedUserId(id);
      fetchCurrentUserAndEvents(id);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    // fallback: fetch all users if no logged-in user
    try {
      setLoading(true);
      const [usersData, eventsData] = await Promise.all([
        userAPI.getAll(),
        eventAPI.getAll()
      ]);
      setUsers(usersData);
      setAllEvents(eventsData);
      if (usersData && usersData.length > 0) {
        setSelectedUserId(usersData[0].id || usersData[0]._id);
        fetchUserEvents(usersData[0].id || usersData[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserAndEvents = async (id) => {
    try {
      setLoading(true);
      const [user, eventsData] = await Promise.all([
        userAPI.getById(id),
        eventAPI.getAll()
      ]);
      setCurrentUser(user);
      setUsers([user]);
      setSelectedUserId(user.id || user._id);
      setAllEvents(eventsData);
      await fetchUserEvents(user.id || user._id);
    } catch (error) {
      console.error('Failed to fetch current user or events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEvents = async (userId) => {
    try {
      const data = await calendarAPI.getByUser(userId);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
    fetchUserEvents(userId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.getUser();
      const payload = { ...formData, userId: formData.userId || selectedUserId || (user && (user.id || user._id)) };
      await calendarAPI.addEvent(payload);
      setFormData({ userId: '', eventTitle: '', eventDate: '' });
      setShowForm(false);
      // Refresh both calendar events and all events
      await Promise.all([
        fetchUserEvents(selectedUserId),
        eventAPI.getAll().then(setAllEvents)
      ]);
    } catch (error) {
      console.error('Failed to add calendar event:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentUser = () => {
    if (currentUser) return currentUser;
    return users.find(user => (user.id || user._id) === selectedUserId);
  };

  const handleDateClick = (date) => {
    // Set the clicked date in the form
    const formattedDate = date.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, eventDate: formattedDate }));
    setShowForm(true);
  };

  const handleEventClick = (event) => {
    // Handle event click - could show event details or edit
    console.log('Event clicked:', event);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">Manage calendar events and view all events</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Current User (no selection required) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Current User</label>
          {getCurrentUser() ? (
            <div className="px-3 py-2 border border-gray-300 rounded-md max-w-md">
              {getCurrentUser().fullName} ({getCurrentUser().email})
            </div>
          ) : (
            <div className="px-3 py-2 border border-gray-300 rounded-md max-w-md text-gray-500">Not logged in</div>
          )}
        </div>

        {/* Add Calendar Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Add Calendar Event</h2>
              <form onSubmit={handleSubmit}>
                {/* Use logged-in user id for calendar events; no selection required */}
                { (formData.userId || selectedUserId) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adding event for (user id)</label>
                    <div className="px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700">{formData.userId || selectedUserId}</div>
                  </div>
                )}
                <FormInput
                  label="Event Title"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Event Date & Time"
                  name="eventDate"
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
                  >
                    Add Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Current User Info */}
        {getCurrentUser() && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{getCurrentUser().fullName}</h3>
                <p className="text-sm text-gray-600">{getCurrentUser().email}</p>
                <p className="text-sm text-gray-500">Role: {getCurrentUser().role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View or List View */}
        {viewMode === 'calendar' ? (
          <CalendarView
            events={allEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <div>
            {/* All Events List */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEvents.map((event) => (
                  <Card key={event.id || event._id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.name || event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.startDate || event.date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Status: {event.status || 'Active'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Calendar Events */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event._id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.eventTitle}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(event.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {allEvents.length === 0 && events.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Create events to see them in the calendar.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
