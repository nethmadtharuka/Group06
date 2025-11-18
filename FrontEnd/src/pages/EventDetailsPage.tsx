import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, CalendarIcon, ClockIcon, MapPinIcon, DollarSignIcon, EyeIcon } from 'lucide-react';
import { eventAPI } from '../services/api';
export const EventDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('details');
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.pathname.includes('bookings')) {
      setActiveTab('bookings');
    } else if (location.pathname.includes('vendors')) {
      setActiveTab('vendors');
    } else {
      setActiveTab('details');
    }
  }, [location]);

  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        try {
          const eventData = await eventAPI.getEventById(id);
          setEvent(eventData);
        } catch (error) {
          console.error('Error loading event:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadEvent();
  }, [id]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Date TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  const tabs = [{
    id: 'details',
    label: 'Event Details',
    path: `/event/${id}`
  }, {
    id: 'bookings',
    label: 'Current Bookings',
    path: `/event/${id}/bookings`
  }, {
    id: 'vendors',
    label: 'Featured Vendors',
    path: `/event/${id}/vendors`
  }];
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="flex flex-col min-h-screen bg-transparent w-full text-white relative">
      <div className="relative h-96">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=1200")'
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0f]"></div>
        </div>
        <div className="absolute top-6 left-6 z-20">
          <Link to="/events" className="inline-flex items-center space-x-2 event-back-button-glass">
            <ChevronLeftIcon size={20} />
            <span>Back to My Events</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-10 z-10">
          <span className="bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full mb-4 inline-block event-status-badge">
            {event?.status || 'EVENT'}
          </span>
          <h1 
            className="text-5xl font-bold event-title-interactive"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            {event?.name ? (
              event.name.split(' ').map((word: string, index: number) => (
                <span key={index} className="inline-block event-title-word mr-2">
                  {word}
                </span>
              ))
            ) : (
              'Loading...'
            )}
          </h1>
        </div>
      </div>
      <div className="border-b border-gray-800">
        <div className="px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => <Link key={tab.id} to={tab.path} className={`py-4 px-1 relative event-tab ${activeTab === tab.id ? 'text-white font-medium' : 'text-gray-400'}`}>
                {tab.label}
                {activeTab === tab.id && <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-purple-600"></motion.span>}
              </Link>)}
          </nav>
        </div>
      </div>
      <main className="p-8">
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.5
      }} className="max-w-5xl">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading event details...</div>
          ) : event ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 event-details-card">
            <h2 
              className="text-2xl font-bold mb-6 event-section-title"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              About This Event
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8 event-description">
                {event.description || 'No description available for this event.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4 event-info-item">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 event-info-icon">
                  <CalendarIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1 event-info-label">Start Date & Time</h3>
                    <p className="text-gray-400 event-info-value">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                {event.endDate && (
              <div className="flex items-start space-x-4 event-info-item">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 event-info-icon">
                  <ClockIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1 event-info-label">End Date & Time</h3>
                      <p className="text-gray-400 event-info-value">{formatDate(event.endDate)}</p>
                </div>
              </div>
                )}
                {event.location && (
              <div className="flex items-start space-x-4 event-info-item">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 event-info-icon">
                  <MapPinIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1 event-info-label">Location</h3>
                      <p className="text-gray-400 event-info-value">{event.location}</p>
                </div>
              </div>
                )}
                {event.budget && (
              <div className="flex items-start space-x-4 event-info-item">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 event-info-icon">
                  <DollarSignIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1 event-info-label">Budget</h3>
                      <p className="text-gray-400 event-info-value">Rs. {event.budget.toLocaleString()}</p>
                </div>
              </div>
                )}
              <div className="flex items-start space-x-4 event-info-item">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 event-info-icon">
                  <EyeIcon size={24} className="text-purple-500" />
                </div>
                <div>
                    <h3 className="font-medium mb-1 event-info-label">Status</h3>
                    <p className="text-gray-400 event-info-value">{event.status || 'PENDING'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">Event not found</div>
          )}
        </motion.div>
      </main>
      <style>{`
        .event-back-button-glass {
          position: relative;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px 20px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
                      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          overflow: hidden;
        }
        .event-back-button-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .event-back-button-glass:hover::before {
          left: 100%;
        }
        .event-back-button-glass:hover {
          transform: translateX(-4px) scale(1.05);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 
                      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
                      0 0 20px rgba(139, 92, 246, 0.3);
        }
        .event-status-badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
        }
        .event-status-badge:hover {
          transform: scale(1.1) rotate(2deg);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .event-title-interactive {
          transition: all 0.3s ease;
        }
        .event-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .event-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #a78bfa;
          text-shadow: 0 8px 24px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .event-tab {
          transition: all 0.3s ease;
          position: relative;
        }
        .event-tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(167, 139, 250, 0.8));
          transition: width 0.3s ease;
        }
        .event-tab:hover::after {
          width: 100%;
        }
        .event-tab:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
        .event-details-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .event-details-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }
        .event-section-title {
          transition: all 0.3s ease;
          cursor: default;
        }
        .event-section-title:hover {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .event-description {
          transition: all 0.3s ease;
        }
        .event-details-card:hover .event-description {
          color: #e9d5ff;
        }
        .event-info-item {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 12px;
          border-radius: 8px;
        }
        .event-info-item:hover {
          transform: translateY(-4px) translateX(4px);
          background: rgba(139, 92, 246, 0.1);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }
        .event-info-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .event-info-item:hover .event-info-icon {
          transform: scale(1.2) rotate(5deg);
          background: rgba(139, 92, 246, 0.3);
        }
        .event-info-label {
          transition: all 0.3s ease;
        }
        .event-info-item:hover .event-info-label {
          color: #a78bfa;
        }
        .event-info-value {
          transition: all 0.3s ease;
        }
        .event-info-item:hover .event-info-value {
          color: #c4b5fd;
        }
      `}</style>
    </motion.div>;
};