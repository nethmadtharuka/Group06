import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { Loading } from '../components/Loading';
import { MapPinIcon, MoreVerticalIcon, TicketIcon, TrophyIcon, BellRingIcon, StarIcon, ArrowRightIcon, HeartIcon, FileTextIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { eventAPI, vendorAPI, chatAPI, userAPI, contractAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
export const UserDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          const userId = localStorage.getItem('userId') || userData.id;
          if (userId) {
            const [userEvents, featured, userActivities, userContracts] = await Promise.all([
              eventAPI.getUpcomingEventsByUser(userId, 10),
              vendorAPI.getFeaturedVendors(6),
              userAPI.getUserActivities(userId, 10),
              contractAPI.getContractsByUser(userId)
            ]);
            setEvents(Array.isArray(userEvents) ? userEvents : []);
            setFeaturedVendors(Array.isArray(featured) ? featured : []);
            setActivities(Array.isArray(userActivities) ? userActivities : []);
            setContracts(Array.isArray(userContracts) ? userContracts : []);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Date TBD';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Date TBD';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Date TBD';
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'Rs. 0';
    return 'Rs. ' + new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleContractClick = (contract: any) => {
    // Transform contract data to match ContractReviewPage format
    const contractData = {
      eventName: contract.event?.name || 'Event',
      eventId: contract.event?.id || '',
      eventDate: contract.event?.startDate || '',
      venue: contract.venue || contract.event?.location || 'Not specified',
      clientName: contract.clientName || '',
      companyName: contract.companyName || '',
      contactEmail: contract.contactEmail || '',
      phoneNumber: contract.phoneNumber || '',
      address: contract.address || '',
      totalFee: contract.totalFee?.toString() || '0',
      depositAmount: contract.depositAmount?.toString() || '0',
      paymentDeadline: contract.paymentDeadline || '',
      customClauses: contract.contractText || '',
      vendorId: contract.vendor?.id || '',
      contractId: contract.id || ''
    };
    
    navigate('/contract/review', {
      state: { contractData, fromDashboard: true }
    });
  };

  const handleContactVendor = async (vendorId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to contact vendors');
      navigate('/login');
      return;
    }

    try {
      const chat = await chatAPI.createOrGetChat({
        vendorId: vendorId,
        userId: userId
      });
      navigate('/messages', { state: { chatId: (chat as any).id } });
    } catch (error: any) {
      console.error('Error creating chat:', error);
      alert(error.message || 'Failed to start conversation. Please try again.');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'EVENT_CREATED':
        return TrophyIcon;
      case 'CONTRACT_CREATED':
      case 'CONTRACT_SIGNED':
        return TicketIcon;
      case 'PAYMENT_COMPLETED':
        return BellRingIcon;
      case 'MESSAGE_SENT':
        return BellRingIcon;
      case 'REVIEW_CREATED':
        return TrophyIcon;
      default:
        return BellRingIcon;
    }
  };
  if (loading) {
    return <Loading />;
  }

  return <div className="flex flex-col min-h-screen bg-transparent w-full relative">
      <Header />
      <main className="p-8">
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold text-white mb-2 dashboard-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block dashboard-title-word">Welcome</span>{' '}
              <span className="inline-block dashboard-title-word">back,</span>{' '}
              <span className="inline-block dashboard-title-word">{user?.fullName || user?.username || "User"}!</span>
            </h1>
            <p 
              className="text-gray-400 dashboard-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block dashboard-subtitle-phrase">Here's a summary</span>{' '}
              <span className="inline-block dashboard-subtitle-phrase">of your events and activities.</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="dashboard-stats-card">
              <StatsCard title="Upcoming Events" value={events.length.toString()} change={`${events.length} events`} isPositive={true} />
            </div>
            <div className="dashboard-stats-card">
              <StatsCard title="Total Events" value={events.length.toString()} change="All events" isPositive={true} />
            </div>
            <div className="dashboard-stats-card">
              <StatsCard title="Active Events" value={events.filter((e: any) => e.status === 'CONFIRMED').length.toString()} change="Confirmed" isPositive={true} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-2xl font-bold text-white dashboard-section-title"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  My Events
                </h2>
                <Link to="/events" className="text-purple-500 hover:text-purple-400 text-sm font-medium dashboard-link">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-12 dashboard-empty-events">
                    <div className="dashboard-empty-image-container mb-6">
                      <div className="dashboard-empty-image-wrapper">
                        <img 
                          src="/Empty.png" 
                          alt="No events" 
                          className="dashboard-empty-image mx-auto"
                        />
                      </div>
                    </div>
                    <p className="text-white mb-2 dashboard-empty-message">
                      <span className="inline-block dashboard-empty-message-word">No</span>{' '}
                      <span className="inline-block dashboard-empty-message-word">events</span>{' '}
                      <span className="inline-block dashboard-empty-message-word">found.</span>{' '}
                      <Link 
                        to="/event/create" 
                        className="inline-block dashboard-empty-link"
                      >
                        <span className="inline-block dashboard-empty-link-word">Create</span>{' '}
                        <span className="inline-block dashboard-empty-link-word">your</span>{' '}
                        <span className="inline-block dashboard-empty-link-word">first</span>{' '}
                        <span className="inline-block dashboard-empty-link-word">event</span>
                      </Link>
                    </p>
                  </div>
                ) : (
                  events.map((event: any, index: number) => (
                    <Link key={event.id || index} to={`/event/${event.id}`} className="block bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 relative dashboard-event-card">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className={`${event.status === 'CONFIRMED' ? 'bg-green-600' : event.status === 'CANCELLED' ? 'bg-red-600' : 'bg-gray-600'} text-xs font-semibold py-1 px-3 rounded-full inline-block mb-3 dashboard-status-badge`}>
                            {event.status || 'PENDING'}
                          </span>
                          <h3 className="text-xl font-bold text-white mb-2 dashboard-event-title">
                            {event.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2 dashboard-event-date">
                            {formatDate(event.startDate)} {event.endDate && `- ${formatDate(event.endDate)}`}
                          </p>
                          {event.location && (
                            <div className="flex items-center text-gray-400 text-sm dashboard-event-location">
                              <MapPinIcon size={16} className="mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <button className="p-2 hover:bg-gray-700 rounded-lg dashboard-event-menu" onClick={(e) => e.preventDefault()}>
                          <MoreVerticalIcon size={20} className="text-gray-400" />
                        </button>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
            <div>
              <h2 
                className="text-2xl font-bold text-white mb-6 dashboard-section-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-12 dashboard-empty-activity">
                    <div className="dashboard-empty-activity-image-container mb-6">
                      <div className="dashboard-empty-activity-image-wrapper">
                        <img 
                          src="/Inactive.png" 
                          alt="No recent activity" 
                          className="dashboard-empty-activity-image mx-auto"
                        />
                      </div>
                    </div>
                    <p className="text-white dashboard-empty-activity-message">
                      <span className="inline-block dashboard-empty-activity-message-word">No</span>{' '}
                      <span className="inline-block dashboard-empty-activity-message-word">recent</span>{' '}
                      <span className="inline-block dashboard-empty-activity-message-word">activity</span>
                    </p>
                  </div>
                ) : (
                  activities.map((activity: any, index: number) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.entityId || index} className="flex items-start space-x-3 dashboard-activity-item">
                        <div className="w-10 h-10 rounded-lg bg-purple-600 bg-opacity-20 flex items-center justify-center flex-shrink-0 dashboard-activity-icon">
                          <Icon size={20} className="text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm dashboard-activity-text">{activity.text}</p>
                          <p className="text-gray-400 text-xs mt-1 dashboard-activity-time">
                            {activity.timeAgo || 'Recently'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 
                  className="text-2xl font-bold text-white mb-2 dashboard-section-title"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Featured Vendors
                </h2>
                <p className="text-gray-400 dashboard-section-subtitle">Top-rated vendors recommended for you</p>
              </div>
              <Link to="/vendors" className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center dashboard-link">
                View All
                <ArrowRightIcon size={16} className="ml-1" />
              </Link>
            </div>
            {featuredVendors.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No featured vendors available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVendors.map((vendor: any, index: number) => (
                  <motion.div
                    key={vendor.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link to={`/vendor/${vendor.id}`} className="block bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700 dashboard-vendor-card">
                      <div className="relative h-48 dashboard-vendor-image">
                        {vendor.mainPhotoURL ? (
                          <img src={vendor.mainPhotoURL} alt={vendor.companyName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{vendor.companyName?.[0] || 'V'}</span>
                          </div>
                        )}
                        <button 
                          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center dashboard-vendor-favorite"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Add favorite functionality
                          }}
                        >
                          <HeartIcon size={20} className="text-white" />
                        </button>
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase dashboard-vendor-type">
                          {vendor.serviceType || 'VENDOR'}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1 mb-2 dashboard-vendor-name">
                          {vendor.companyName}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 dashboard-vendor-address">
                          {vendor.address || 'Location not specified'}
                        </p>
                        <div className="flex items-center dashboard-vendor-rating">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(star => (
                              <StarIcon 
                                key={star} 
                                size={16} 
                                fill={star <= Math.round(vendor.rating || 0) ? "currentColor" : "none"}
                                className={star <= Math.round(vendor.rating || 0) ? "text-yellow-400" : "text-gray-600"}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-white font-medium">
                            {vendor.rating ? vendor.rating.toFixed(1) : '0.0'}
                          </span>
                          <span className="ml-1 text-gray-400 text-sm">
                            (reviews)
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 
                  className="text-2xl font-bold text-white mb-2 dashboard-section-title"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Active Contracts
                </h2>
                <p className="text-gray-400 dashboard-section-subtitle">Your recent contracts and agreements</p>
              </div>
            </div>
            {contracts.length === 0 ? (
              <div className="text-center py-12 dashboard-empty-contracts">
                <div className="dashboard-empty-contracts-image-container mb-6">
                  <div className="dashboard-empty-contracts-image-wrapper">
                    <img 
                      src="/Contract.png" 
                      alt="No contracts" 
                      className="dashboard-empty-contracts-image mx-auto"
                    />
                  </div>
                </div>
                <p className="text-white mb-2 dashboard-empty-contracts-message">
                  <span className="inline-block dashboard-empty-contracts-message-word">No</span>{' '}
                  <span className="inline-block dashboard-empty-contracts-message-word">contracts</span>{' '}
                  <span className="inline-block dashboard-empty-contracts-message-word">found.</span>{' '}
                  <Link 
                    to="/vendors" 
                    className="inline-block dashboard-empty-contracts-link"
                  >
                    <span className="inline-block dashboard-empty-contracts-link-word">Browse</span>{' '}
                    <span className="inline-block dashboard-empty-contracts-link-word">vendors</span>{' '}
                    <span className="inline-block dashboard-empty-contracts-link-word">to</span>{' '}
                    <span className="inline-block dashboard-empty-contracts-link-word">create</span>{' '}
                    <span className="inline-block dashboard-empty-contracts-link-word">a</span>{' '}
                    <span className="inline-block dashboard-empty-contracts-link-word">contract</span>
                  </Link>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {contracts.slice(0, 4).map((contract: any, index: number) => (
                  <motion.div
                    key={contract.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleContractClick(contract)}
                    className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 cursor-pointer dashboard-contract-card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-600 bg-opacity-20 flex items-center justify-center dashboard-contract-icon">
                          <FileTextIcon size={24} className="text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white dashboard-contract-title">
                            {contract.vendor?.companyName || 'Contract'}
                          </h3>
                          <p className="text-gray-400 text-sm dashboard-contract-event">
                            {contract.event?.name || 'Event Contract'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold py-1 px-3 rounded-full dashboard-contract-status ${
                        contract.signed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {contract.signed ? 'Signed' : 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {contract.totalFee && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Total Fee:</span>
                          <span className="text-white font-semibold">
                            {formatCurrency(contract.totalFee)}
                          </span>
                        </div>
                      )}
                      {contract.createdAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Created:</span>
                          <span className="text-gray-300">
                            {formatDate(contract.createdAt)}
                          </span>
                        </div>
                      )}
                      {contract.paymentDeadline && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Payment Deadline:</span>
                          <span className="text-gray-300">
                            {formatDate(contract.paymentDeadline)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      <style>{`
        .dashboard-title-interactive {
          transition: all 0.3s ease;
        }
        .dashboard-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .dashboard-title-word:hover {
          transform: translateY(-4px) scale(1.05);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .dashboard-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .dashboard-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: default;
        }
        .dashboard-subtitle-phrase:hover {
          transform: translateY(-2px) scale(1.03);
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.15);
        }
        .dashboard-stats-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-stats-card:hover {
          transform: translateY(-6px) scale(1.02);
        }
        .dashboard-section-title {
          transition: all 0.3s ease;
          cursor: default;
        }
        .dashboard-section-title:hover {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .dashboard-section-subtitle {
          transition: all 0.3s ease;
        }
        .dashboard-section-subtitle:hover {
          color: #c4b5fd;
        }
        .dashboard-link {
          transition: all 0.3s ease;
          position: relative;
        }
        .dashboard-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(167, 139, 250, 0.8));
          transition: width 0.3s ease;
        }
        .dashboard-link:hover::after {
          width: 100%;
        }
        .dashboard-link:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
        .dashboard-event-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-event-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2), 0 0 16px rgba(139, 92, 246, 0.1);
        }
        .dashboard-status-badge {
          transition: all 0.3s ease;
        }
        .dashboard-event-card:hover .dashboard-status-badge {
          transform: scale(1.1);
        }
        .dashboard-event-title {
          transition: all 0.3s ease;
        }
        .dashboard-event-card:hover .dashboard-event-title {
          color: #a78bfa;
        }
        .dashboard-event-date,
        .dashboard-event-location {
          transition: all 0.3s ease;
        }
        .dashboard-event-card:hover .dashboard-event-date,
        .dashboard-event-card:hover .dashboard-event-location {
          color: #c4b5fd;
        }
        .dashboard-event-menu {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-event-menu:hover {
          transform: scale(1.1) rotate(90deg);
          background: rgba(139, 92, 246, 0.2);
        }
        .dashboard-activity-item {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 8px;
          border-radius: 8px;
        }
        .dashboard-activity-item:hover {
          transform: translateX(8px);
          background: rgba(139, 92, 246, 0.1);
        }
        .dashboard-activity-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-activity-item:hover .dashboard-activity-icon {
          transform: scale(1.2) rotate(5deg);
          background: rgba(139, 92, 246, 0.3);
        }
        .dashboard-activity-text {
          transition: all 0.3s ease;
        }
        .dashboard-activity-item:hover .dashboard-activity-text {
          color: #c4b5fd;
        }
        .dashboard-activity-time {
          transition: all 0.3s ease;
        }
        .dashboard-activity-item:hover .dashboard-activity-time {
          color: #a78bfa;
        }
        .dashboard-vendor-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-vendor-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
        }
        .dashboard-vendor-image {
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .dashboard-vendor-card:hover .dashboard-vendor-image img {
          transform: scale(1.1);
        }
        .dashboard-vendor-favorite {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-vendor-favorite:hover {
          transform: scale(1.2) rotate(10deg);
          background: rgba(255, 255, 255, 0.3);
        }
        .dashboard-vendor-type {
          transition: all 0.3s ease;
        }
        .dashboard-vendor-card:hover .dashboard-vendor-type {
          color: #a78bfa;
        }
        .dashboard-vendor-name {
          transition: all 0.3s ease;
        }
        .dashboard-vendor-card:hover .dashboard-vendor-name {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .dashboard-vendor-address {
          transition: all 0.3s ease;
        }
        .dashboard-vendor-card:hover .dashboard-vendor-address {
          color: #c4b5fd;
        }
        .dashboard-vendor-rating {
          transition: all 0.3s ease;
        }
        .dashboard-vendor-card:hover .dashboard-vendor-rating {
          transform: scale(1.05);
        }
        .dashboard-contract-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-contract-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
        }
        .dashboard-contract-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-contract-card:hover .dashboard-contract-icon {
          transform: scale(1.15) rotate(5deg);
          background: rgba(139, 92, 246, 0.3);
        }
        .dashboard-contract-title {
          transition: all 0.3s ease;
        }
        .dashboard-contract-card:hover .dashboard-contract-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .dashboard-contract-event {
          transition: all 0.3s ease;
        }
        .dashboard-contract-card:hover .dashboard-contract-event {
          color: #c4b5fd;
        }
        .dashboard-contract-status {
          transition: all 0.3s ease;
        }
        .dashboard-contract-card:hover .dashboard-contract-status {
          transform: scale(1.1);
        }
        .dashboard-empty-events {
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
        .dashboard-empty-image-container {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-empty-events:hover .dashboard-empty-image-container {
          transform: scale(1.05);
        }
        .dashboard-empty-image-wrapper {
          position: relative;
          display: inline-block;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-empty-image {
          position: relative;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: 300px;
          height: auto;
        }
        .dashboard-empty-image-wrapper:hover .dashboard-empty-image {
          transform: scale(1.1);
        }
        .dashboard-empty-message {
          font-size: 1.125rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
          margin-top: 20px;
        }
        .dashboard-empty-message-word,
        .dashboard-empty-link-word {
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }
        .dashboard-empty-events:hover .dashboard-empty-message-word {
          animation: textShake 0.5s ease-in-out;
        }
        .dashboard-empty-link {
          color: #a78bfa;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        .dashboard-empty-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #a78bfa, #8b5cf6);
          transition: width 0.3s ease;
        }
        .dashboard-empty-link:hover {
          color: #8b5cf6;
        }
        .dashboard-empty-link:hover::after {
          width: 100%;
        }
        .dashboard-empty-events:hover .dashboard-empty-link-word {
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
        .dashboard-empty-activity {
          animation: fadeInUp 0.6s ease-out;
        }
        .dashboard-empty-activity-image-container {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-empty-activity:hover .dashboard-empty-activity-image-container {
          transform: scale(1.05);
        }
        .dashboard-empty-activity-image-wrapper {
          position: relative;
          display: inline-block;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-empty-activity-image {
          position: relative;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: 250px;
          height: auto;
        }
        .dashboard-empty-activity-image-wrapper:hover .dashboard-empty-activity-image {
          transform: scale(1.1);
        }
        .dashboard-empty-activity-message {
          font-size: 1.125rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
          margin-top: 20px;
        }
        .dashboard-empty-activity-message-word {
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }
        .dashboard-empty-activity:hover .dashboard-empty-activity-message-word {
          animation: textShake 0.5s ease-in-out;
        }
        .dashboard-empty-contracts {
          animation: fadeInUp 0.6s ease-out;
        }
        .dashboard-empty-contracts-image-container {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-empty-contracts:hover .dashboard-empty-contracts-image-container {
          transform: scale(1.05);
        }
        .dashboard-empty-contracts-image-wrapper {
          position: relative;
          display: inline-block;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dashboard-empty-contracts-image {
          position: relative;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: 300px;
          height: auto;
        }
        .dashboard-empty-contracts-image-wrapper:hover .dashboard-empty-contracts-image {
          transform: scale(1.1);
        }
        .dashboard-empty-contracts-message {
          font-size: 1.125rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
          margin-top: 20px;
        }
        .dashboard-empty-contracts-message-word,
        .dashboard-empty-contracts-link-word {
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }
        .dashboard-empty-contracts:hover .dashboard-empty-contracts-message-word {
          animation: textShake 0.5s ease-in-out;
        }
        .dashboard-empty-contracts-link {
          color: #a78bfa;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        .dashboard-empty-contracts-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #a78bfa, #8b5cf6);
          transition: width 0.3s ease;
        }
        .dashboard-empty-contracts-link:hover {
          color: #8b5cf6;
        }
        .dashboard-empty-contracts-link:hover::after {
          width: 100%;
        }
        .dashboard-empty-contracts:hover .dashboard-empty-contracts-link-word {
          animation: textBounce 0.6s ease-in-out;
        }
      `}</style>
    </div>;
};