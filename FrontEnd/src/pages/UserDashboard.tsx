import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
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
            setEvents(userEvents || []);
            setFeaturedVendors(featured || []);
            setActivities(userActivities || []);
            setContracts(userContracts || []);
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
    if (amount === undefined || amount === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
    return <div className="flex min-h-screen bg-[#0a0a0f] w-full items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full">
      <Header />
      <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.fullName || user?.username || "User"}!
            </h1>
            <p className="text-gray-400">
              Here's a summary of your events and activities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard title="Upcoming Events" value={events.length.toString()} change={`${events.length} events`} isPositive={true} />
            <StatsCard title="Total Events" value={events.length.toString()} change="All events" isPositive={true} />
            <StatsCard title="Active Events" value={events.filter((e: any) => e.status === 'CONFIRMED').length.toString()} change="Confirmed" isPositive={true} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Events</h2>
                <Link to="/events" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No events found. <Link to="/events" className="text-purple-500 hover:text-purple-400">Create your first event</Link></p>
                  </div>
                ) : (
                  events.map((event: any, index: number) => (
                    <Link key={event.id || index} to={`/event/${event.id}`} className="block bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 relative hover:border-purple-500 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className={`${event.status === 'CONFIRMED' ? 'bg-green-600' : event.status === 'CANCELLED' ? 'bg-red-600' : 'bg-gray-600'} text-xs font-semibold py-1 px-3 rounded-full inline-block mb-3`}>
                            {event.status || 'PENDING'}
                          </span>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {event.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {formatDate(event.startDate)} {event.endDate && `- ${formatDate(event.endDate)}`}
                          </p>
                          {event.location && (
                            <div className="flex items-center text-gray-400 text-sm">
                              <MapPinIcon size={16} className="mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <button className="p-2 hover:bg-gray-700 rounded-lg" onClick={(e) => e.preventDefault()}>
                          <MoreVerticalIcon size={20} className="text-gray-400" />
                        </button>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No recent activity</p>
                  </div>
                ) : (
                  activities.map((activity: any, index: number) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.entityId || index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.text}</p>
                          <p className="text-gray-400 text-xs mt-1">
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
                <h2 className="text-2xl font-bold text-white mb-2">Featured Vendors</h2>
                <p className="text-gray-400">Top-rated vendors recommended for you</p>
              </div>
              <Link to="/vendors" className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center">
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
                    <Link to={`/vendor/${vendor.id}`} className="block bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
                      <div className="relative h-48">
                        {vendor.mainPhotoURL ? (
                          <img src={vendor.mainPhotoURL} alt={vendor.companyName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{vendor.companyName?.[0] || 'V'}</span>
                          </div>
                        )}
                        <button 
                          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Add favorite functionality
                          }}
                        >
                          <HeartIcon size={20} className="text-white" />
                        </button>
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase">
                          {vendor.serviceType || 'VENDOR'}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1 mb-2">
                          {vendor.companyName}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {vendor.address || 'Location not specified'}
                        </p>
                        <div className="flex items-center">
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
                <h2 className="text-2xl font-bold text-white mb-2">Active Contracts</h2>
                <p className="text-gray-400">Your recent contracts and agreements</p>
              </div>
            </div>
            {contracts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileTextIcon size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No contracts found.</p>
                <Link to="/vendors" className="text-purple-500 hover:text-purple-400 mt-2 inline-block">
                  Browse vendors to create a contract
                </Link>
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
                    className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-600 bg-opacity-20 flex items-center justify-center">
                          <FileTextIcon size={24} className="text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {contract.vendor?.companyName || 'Contract'}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {contract.event?.name || 'Event Contract'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold py-1 px-3 rounded-full ${
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
    </div>;
};