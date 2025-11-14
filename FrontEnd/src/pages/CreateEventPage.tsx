import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellIcon, UserCircleIcon, CalendarIcon } from 'lucide-react';
import { eventAPI } from '../services/api';
import { Header } from '../components/Header';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateEvent = async () => {
    setError('');
    
    if (!formData.name.trim()) {
      setError('Event name is required');
      return;
    }

    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create an event');
        navigate('/login');
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

      const event = await eventAPI.createEvent(eventData);
      
      // Navigate to the event details page
      navigate(`/event/${(event as any).id}`);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full text-white">
      <Header />
      <main className="p-8">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }} 
          className="text-4xl font-bold mb-8"
        >
          Create a New Event
        </motion.h1>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.5, delay: 0.1 }} 
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Event Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Event Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your event..."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">Start Date *</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">End Date</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      min={formData.startDate}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter event location"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Budget ($)</label>
                  <input 
                    type="number" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="Enter event budget"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }} 
            className="space-y-6"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Event Summary</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <span className="text-gray-400 text-sm">Event Name</span>
                  <p className="text-white font-medium mt-1">{formData.name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Start Date</span>
                  <p className="text-white font-medium mt-1">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                {formData.endDate && (
                  <div>
                    <span className="text-gray-400 text-sm">End Date</span>
                    <p className="text-white font-medium mt-1">
                      {new Date(formData.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {formData.location && (
                  <div>
                    <span className="text-gray-400 text-sm">Location</span>
                    <p className="text-white font-medium mt-1">{formData.location}</p>
                  </div>
                )}
                {formData.budget && (
                  <div>
                    <span className="text-gray-400 text-sm">Budget</span>
                    <p className="text-white font-bold text-xl mt-1">
                      ${parseFloat(formData.budget).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <button 
                  onClick={handleCreateEvent}
                  disabled={loading || !formData.name.trim() || !formData.startDate}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                >
                  <CalendarIcon size={20} />
                  <span>{loading ? 'Creating...' : 'Create Event'}</span>
                </button>
                <Link 
                  to="/events" 
                  className="block text-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

