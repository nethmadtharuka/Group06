import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-transparent w-full text-white relative">
      <Header />
      <main className="p-8">
        <h1 
          className="text-4xl font-bold mb-8 create-event-title"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <span className="inline-block create-event-title-word">Create</span>{' '}
          <span className="inline-block create-event-title-word">a</span>{' '}
          <span className="inline-block create-event-title-word">New</span>{' '}
          <span className="inline-block create-event-title-word">Event</span>
        </h1>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg create-event-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 create-event-form-card">
              <h2 
                className="text-2xl font-bold mb-6 create-event-form-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Event Information
              </h2>
              <div className="space-y-6">
                <div className="create-event-field-group">
                  <label className="block text-white mb-2 create-event-label">Event Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-event-input" 
                    required
                  />
                </div>
                <div className="create-event-field-group">
                  <label className="block text-white mb-2 create-event-label">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your event..."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none create-event-textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="create-event-field-group">
                    <label className="block text-white mb-2 create-event-label">Start Date *</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 create-event-input" 
                      required
                    />
                  </div>
                  <div className="create-event-field-group">
                    <label className="block text-white mb-2 create-event-label">End Date</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      min={formData.startDate}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 create-event-input" 
                    />
                  </div>
                </div>
                <div className="create-event-field-group">
                  <label className="block text-white mb-2 create-event-label">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter event location"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-event-input" 
                  />
                </div>
                <div className="create-event-field-group">
                  <label className="block text-white mb-2 create-event-label">Budget (LKR)</label>
                  <input 
                    type="number" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="Enter event budget"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-event-input" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8 create-event-summary-card">
              <h2 
                className="text-xl font-bold mb-6 create-event-summary-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Event Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="create-event-summary-item">
                  <span className="text-gray-400 text-sm create-event-summary-label">Event Name</span>
                  <p className="text-white font-medium mt-1 create-event-summary-value">{formData.name || 'Not set'}</p>
                </div>
                <div className="create-event-summary-item">
                  <span className="text-gray-400 text-sm create-event-summary-label">Start Date</span>
                  <p className="text-white font-medium mt-1 create-event-summary-value">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                {formData.endDate && (
                  <div className="create-event-summary-item">
                    <span className="text-gray-400 text-sm create-event-summary-label">End Date</span>
                    <p className="text-white font-medium mt-1 create-event-summary-value">
                      {new Date(formData.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {formData.location && (
                  <div className="create-event-summary-item">
                    <span className="text-gray-400 text-sm create-event-summary-label">Location</span>
                    <p className="text-white font-medium mt-1 create-event-summary-value">{formData.location}</p>
                  </div>
                )}
                {formData.budget && (
                  <div className="create-event-summary-item">
                    <span className="text-gray-400 text-sm create-event-summary-label">Budget</span>
                    <p className="text-white font-bold text-xl mt-1 create-event-summary-budget">
                      Rs. {parseFloat(formData.budget).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <button 
                  onClick={handleCreateEvent}
                  disabled={loading || !formData.name.trim() || !formData.startDate}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg create-event-submit-button"
                >
                  <CalendarIcon size={20} />
                  <span>{loading ? 'Creating...' : 'Create Event'}</span>
                </button>
                <Link 
                  to="/events" 
                  className="block text-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg create-event-cancel-button"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`
        .create-event-title {
          transition: all 0.3s ease;
        }
        .create-event-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .create-event-title-word:hover {
          transform: translateY(-4px) scale(1.1);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .create-event-error {
          transition: all 0.3s ease;
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .create-event-form-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-event-form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .create-event-form-title {
          transition: all 0.3s ease;
        }
        .create-event-form-card:hover .create-event-form-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .create-event-field-group {
          transition: all 0.3s ease;
        }
        .create-event-form-card:hover .create-event-field-group {
          transform: translateX(4px);
        }
        .create-event-label {
          transition: all 0.3s ease;
        }
        .create-event-field-group:hover .create-event-label {
          color: #a78bfa;
        }
        .create-event-input,
        .create-event-textarea {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-event-input:focus,
        .create-event-textarea:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .create-event-input:hover:not(:focus),
        .create-event-textarea:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-1px);
        }
        .create-event-summary-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-event-summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .create-event-summary-title {
          transition: all 0.3s ease;
        }
        .create-event-summary-card:hover .create-event-summary-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .create-event-summary-item {
          transition: all 0.3s ease;
        }
        .create-event-summary-card:hover .create-event-summary-item {
          transform: translateX(4px);
        }
        .create-event-summary-label {
          transition: all 0.3s ease;
        }
        .create-event-summary-card:hover .create-event-summary-label {
          color: #a78bfa;
        }
        .create-event-summary-value {
          transition: all 0.3s ease;
        }
        .create-event-summary-card:hover .create-event-summary-value {
          color: #c4b5fd;
        }
        .create-event-summary-budget {
          transition: all 0.3s ease;
        }
        .create-event-summary-card:hover .create-event-summary-budget {
          transform: scale(1.1);
          color: #a78bfa;
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .create-event-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .create-event-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .create-event-submit-button:hover::before {
          left: 100%;
        }
        .create-event-submit-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .create-event-cancel-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-event-cancel-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
        }
      `}</style>
    </div>
  );
};

