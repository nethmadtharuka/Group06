import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, PlusCircleIcon, MapPinIcon, ClockIcon, CalendarIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { eventAPI } from '../services/api';
export const MyEventsPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userEvents = await eventAPI.getEventsByUser(userId);
          setEvents(userEvents || []);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Date TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredEvents = events.filter((event: any) => 
    event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mockEvents = [{
    id: 1,
    category: 'WEDDING',
    categoryColor: 'bg-purple-600',
    title: "Sophia & Liam's Wedding",
    date: 'October 26, 2024',
    time: '4:00 PM - 11:00 PM',
    location: 'The Grand Ballroom',
    status: 'Upcoming',
    statusColor: 'text-green-500',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
  }, {
    id: 2,
    category: 'CORPORATE',
    categoryColor: 'bg-blue-600',
    title: 'Innovate Summit 2024',
    date: 'November 12, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Metro Convention Center',
    status: 'Upcoming',
    statusColor: 'text-green-500',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  }, {
    id: 3,
    category: 'BIRTHDAY',
    categoryColor: 'bg-pink-600',
    title: "Mia's 30th Birthday Bash",
    date: 'September 15, 2024',
    time: '8:00 PM - Late',
    location: 'The Loft Venue',
    status: 'Past',
    statusColor: 'text-gray-500',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'
  }, {
    id: 4,
    category: 'CONCERT',
    categoryColor: 'bg-orange-600',
    title: 'Summer Music Festival',
    date: 'August 20, 2024',
    time: '12:00 PM - 10:00 PM',
    location: 'City Park Amphitheater',
    status: 'Past',
    statusColor: 'text-gray-500',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800'
  }];
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="flex flex-col min-h-screen bg-[#0a0a0f] w-full text-white">
      <Header />
      <main className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 initial={{
          x: -20,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="text-4xl font-bold">
            My Events
          </motion.h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
              />
            </div>
            <Link to="/event/create" className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-all transform hover:scale-105">
              <PlusCircleIcon size={20} />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{
          x: -20,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {monthNames[currentMonth.getMonth()]}{' '}
                {currentMonth.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <ChevronLeftIcon size={20} />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <ChevronRightIcon size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-center text-xs text-gray-400 font-medium">
                  {day}
                </div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({
              length: firstDayOfMonth
            }).map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
              {Array.from({
              length: daysInMonth
            }).map((_, i) => {
              const day = i + 1;
              const isToday = day === 26;
              return <button key={day} className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${isToday ? 'bg-purple-600 text-white font-bold' : 'hover:bg-gray-700 text-gray-300'}`}>
                    {day}
                  </button>;
            })}
            </div>
          </motion.div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-8 text-gray-400">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-400">
                <p>No events found. <Link to="/contract/new" className="text-purple-500 hover:text-purple-400">Create your first event</Link></p>
              </div>
            ) : (
              filteredEvents.map((event: any, index: number) => (
                <motion.div key={event.id || index} initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.1 + index * 0.1
          }} whileHover={{
            y: -4,
            transition: {
              duration: 0.2
            }
          }}>
                <Link to={`/event/${event.id}`} className="block bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all">
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600">
                    <div className="absolute top-4 left-4">
                      <span className={`${event.status === 'CONFIRMED' ? 'bg-green-600' : event.status === 'CANCELLED' ? 'bg-red-600' : 'bg-gray-600'} text-xs font-semibold py-1 px-3 rounded-full text-white`}>
                        {event.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{event.name}</h3>
                    {event.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <CalendarIcon size={16} className="mr-2" />
                        <span>{formatDate(event.startDate)} {event.endDate && `- ${formatDate(event.endDate)}`}</span>
                      </div>
                      {event.location && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPinIcon size={16} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      )}
                      {event.budget && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <span>Budget: ${event.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${event.status === 'CONFIRMED' ? 'text-green-500' : event.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-500'}`}>
                        {event.status || 'PENDING'}
                      </span>
                      <button 
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVerticalIcon size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )))}
          </div>
        </div>
      </main>
    </motion.div>;
};