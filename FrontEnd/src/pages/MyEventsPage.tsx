import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, PlusCircleIcon, MapPinIcon, ClockIcon, CalendarIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
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
  }} className="flex flex-col min-h-screen bg-transparent w-full text-white relative">
      <Header />
      <main className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 
            className="text-4xl font-bold my-events-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            <span className="inline-block my-events-title-word">My</span>{' '}
            <span className="inline-block my-events-title-word">Events</span>
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative my-events-search-container">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 my-events-search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 my-events-search-input" 
              />
            </div>
            <Link to="/event/create" className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg my-events-create-button">
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
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-700 rounded my-events-calendar-nav text-white">
                  <ChevronLeftIcon size={20} />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-700 rounded my-events-calendar-nav text-white">
                  <ChevronRightIcon size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-center text-xs text-gray-400 font-medium my-events-weekday">
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
              return <button key={day} className={`aspect-square flex items-center justify-center rounded-lg text-sm my-events-calendar-day ${isToday ? 'bg-purple-600 text-white font-bold' : 'text-white'}`}>
                    {day}
                  </button>;
            })}
            </div>
          </motion.div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 flex items-center justify-center py-8">
                <Loading fullScreen={false} />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-2 text-center py-12 my-events-empty">
                <div className="my-events-empty-image-container mb-6">
                  <div className="my-events-empty-image-wrapper">
                    <img 
                      src="/Empty.png" 
                      alt="No events" 
                      className="my-events-empty-image mx-auto"
                    />
                  </div>
                </div>
                <p className="text-white mb-2 my-events-empty-message">
                  <span className="inline-block my-events-empty-message-word">No</span>{' '}
                  <span className="inline-block my-events-empty-message-word">events</span>{' '}
                  <span className="inline-block my-events-empty-message-word">found.</span>{' '}
                  <Link 
                    to="/event/create" 
                    className="inline-block my-events-empty-link"
                  >
                    <span className="inline-block my-events-empty-link-word">Create</span>{' '}
                    <span className="inline-block my-events-empty-link-word">your</span>{' '}
                    <span className="inline-block my-events-empty-link-word">first</span>{' '}
                    <span className="inline-block my-events-empty-link-word">event</span>
                  </Link>
                </p>
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
                <Link to={`/event/${event.id}`} className="block bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden my-events-card">
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 my-events-card-image">
                    <div className="absolute top-4 left-4">
                      <span className={`${event.status === 'CONFIRMED' ? 'bg-green-600' : event.status === 'CANCELLED' ? 'bg-red-600' : 'bg-gray-600'} text-xs font-semibold py-1 px-3 rounded-full text-white my-events-status-badge`}>
                        {event.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 my-events-card-title">{event.name}</h3>
                    {event.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2 my-events-card-description">{event.description}</p>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm my-events-card-date">
                        <CalendarIcon size={16} className="mr-2" />
                        <span>{formatDate(event.startDate)} {event.endDate && `- ${formatDate(event.endDate)}`}</span>
                      </div>
                      {event.location && (
                      <div className="flex items-center text-gray-400 text-sm my-events-card-location">
                        <MapPinIcon size={16} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      )}
                      {event.budget && (
                        <div className="flex items-center text-gray-400 text-sm my-events-card-budget">
                          <span>Budget: Rs. {event.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium my-events-card-status ${event.status === 'CONFIRMED' ? 'text-green-500' : event.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-500'}`}>
                        {event.status || 'PENDING'}
                      </span>
                      <button 
                        className="p-2 hover:bg-gray-700 rounded-lg my-events-card-menu"
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
      <style>{`
        .my-events-title {
          transition: all 0.3s ease;
        }
        .my-events-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .my-events-title-word:hover {
          transform: translateY(-4px) scale(1.1);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .my-events-search-container {
          transition: all 0.3s ease;
        }
        .my-events-search-icon {
          transition: all 0.3s ease;
        }
        .my-events-search-container:hover .my-events-search-icon {
          color: #a78bfa;
          transform: scale(1.1);
        }
        .my-events-search-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-search-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .my-events-search-input:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-1px);
        }
        .my-events-create-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .my-events-create-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .my-events-create-button:hover::before {
          left: 100%;
        }
        .my-events-create-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .my-events-calendar-nav {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-calendar-nav:hover {
          transform: scale(1.2) rotate(5deg);
          background: rgba(139, 92, 246, 0.2);
        }
        .my-events-weekday {
          transition: all 0.3s ease;
        }
        .my-events-weekday:hover {
          color: #a78bfa;
          transform: translateY(-2px);
        }
        .my-events-calendar-day {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-calendar-day:hover {
          transform: scale(1.15);
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }
        .my-events-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
        }
        .my-events-card-image {
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .my-events-card:hover .my-events-card-image {
          transform: scale(1.05);
        }
        .my-events-status-badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-card:hover .my-events-status-badge {
          transform: scale(1.15) rotate(2deg);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .my-events-card-title {
          transition: all 0.3s ease;
        }
        .my-events-card:hover .my-events-card-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .my-events-card-description {
          transition: all 0.3s ease;
        }
        .my-events-card:hover .my-events-card-description {
          color: #c4b5fd;
        }
        .my-events-card-date,
        .my-events-card-location,
        .my-events-card-budget {
          transition: all 0.3s ease;
        }
        .my-events-card:hover .my-events-card-date,
        .my-events-card:hover .my-events-card-location,
        .my-events-card:hover .my-events-card-budget {
          color: #c4b5fd;
          transform: translateX(4px);
        }
        .my-events-card-status {
          transition: all 0.3s ease;
        }
        .my-events-card:hover .my-events-card-status {
          transform: scale(1.1);
        }
        .my-events-card-menu {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-card-menu:hover {
          transform: scale(1.2) rotate(90deg);
          background: rgba(139, 92, 246, 0.2);
        }
        .my-events-empty {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .my-events-empty-image-container {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .my-events-empty:hover .my-events-empty-image-container {
          transform: scale(1.05);
        }
        .my-events-empty-image-wrapper {
          position: relative;
          display: inline-block;
          padding: 20px;
          border-radius: 20px;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1;
        }
        .my-events-empty-image-wrapper::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4));
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.8);
          z-index: -1;
        }
        .my-events-empty-image-wrapper::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border-radius: 20px;
          border: 3px solid rgba(139, 92, 246, 0.6);
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.9);
          z-index: -1;
        }
        .my-events-empty-image-wrapper:hover::before {
          opacity: 1;
          transform: scale(1.1);
          animation: myEventsBorderPulse 2s ease-in-out infinite;
        }
        .my-events-empty-image-wrapper:hover::after {
          opacity: 1;
          transform: scale(1.15);
          animation: myEventsBorderPulse 2s ease-in-out infinite 0.1s;
        }
        .my-events-empty-image-wrapper:hover {
          transform: scale(1.05);
        }
        .my-events-empty-image {
          position: relative;
          z-index: 1;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: 300px;
          height: auto;
          filter: drop-shadow(0 0 0 rgba(139, 92, 246, 0));
        }
        .my-events-empty-image-wrapper:hover .my-events-empty-image {
          transform: scale(1.1) translateY(-5px);
          filter: drop-shadow(0 10px 30px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
        }
        @keyframes myEventsBorderPulse {
          0%, 100% {
            border-color: rgba(139, 92, 246, 0.6);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            border-color: rgba(139, 92, 246, 1);
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          }
        }
        .my-events-empty-message {
          font-size: 1.125rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
          margin-top: 20px;
        }
        .my-events-empty-message-word,
        .my-events-empty-link-word {
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }
        .my-events-empty:hover .my-events-empty-message-word {
          animation: textShake 0.5s ease-in-out;
        }
        .my-events-empty-link {
          color: #a78bfa;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        .my-events-empty-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #a78bfa, #8b5cf6);
          transition: width 0.3s ease;
        }
        .my-events-empty-link:hover {
          color: #8b5cf6;
        }
        .my-events-empty-link:hover::after {
          width: 100%;
        }
        .my-events-empty:hover .my-events-empty-link-word {
          animation: textBounce 0.6s ease-in-out;
        }
        @keyframes textShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        @keyframes textBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </motion.div>;
};