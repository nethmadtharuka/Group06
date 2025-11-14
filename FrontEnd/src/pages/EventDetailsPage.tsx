import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, CalendarIcon, ClockIcon, MapPinIcon, DollarSignIcon, EyeIcon } from 'lucide-react';
import { Header } from '../components/Header';
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
  }} className="flex flex-col min-h-screen bg-[#0a0a0f] w-full text-white">
      <Header />
      <div className="relative h-96">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=1200")'
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0f]"></div>
        </div>
        <div className="relative z-10 px-8 py-6">
          <Link to="/events" className="inline-flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/80 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm">
            <ChevronLeftIcon size={20} />
            <span>Back to My Events</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-10">
          <span className="bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full mb-4 inline-block">
            {event?.status || 'EVENT'}
          </span>
          <h1 className="text-5xl font-bold">{event?.name || 'Loading...'}</h1>
        </div>
      </div>
      <div className="border-b border-gray-800">
        <div className="px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => <Link key={tab.id} to={tab.path} className={`py-4 px-1 relative transition-colors ${activeTab === tab.id ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}>
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
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">About This Event</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
                {event.description || 'No description available for this event.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CalendarIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Start Date & Time</h3>
                    <p className="text-gray-400">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                {event.endDate && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClockIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">End Date & Time</h3>
                      <p className="text-gray-400">{formatDate(event.endDate)}</p>
                </div>
              </div>
                )}
                {event.location && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                      <p className="text-gray-400">{event.location}</p>
                </div>
              </div>
                )}
                {event.budget && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSignIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Budget</h3>
                      <p className="text-gray-400">${event.budget.toLocaleString()}</p>
                </div>
              </div>
                )}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EyeIcon size={24} className="text-purple-500" />
                </div>
                <div>
                    <h3 className="font-medium mb-1">Status</h3>
                    <p className="text-gray-400">{event.status || 'PENDING'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">Event not found</div>
          )}
        </motion.div>
      </main>
    </motion.div>;
};