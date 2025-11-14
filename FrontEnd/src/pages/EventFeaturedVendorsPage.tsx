import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, StarIcon, DollarSignIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { eventAPI, chatAPI } from '../services/api';

export const EventFeaturedVendorsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          // Load event details
          const eventData = await eventAPI.getEventById(id);
          setEvent(eventData);

          // Load featured vendors
          const featuredVendors = await eventAPI.getFeaturedVendorsForEvent(id);
          setVendors(featuredVendors || []);
        } catch (error) {
          console.error('Error loading featured vendors:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [id]);

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

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
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
          <Link to={`/event/${id}`} className="inline-flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/80 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm">
            <ChevronLeftIcon size={20} />
            <span>Back to My Events</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-10">
          <span className="bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full mb-4 inline-block">
            {event?.status || 'EVENT'}
          </span>
          <h1 className="text-5xl font-bold">{event?.name || 'Loading...'}</h1>
          {event?.budget && (
            <p className="text-gray-300 mt-2 flex items-center">
              <DollarSignIcon size={20} className="mr-1" />
              Budget: {formatCurrency(event.budget)}
            </p>
          )}
        </div>
      </div>
      <div className="border-b border-gray-800">
        <div className="px-8">
          <nav className="flex space-x-8">
            <Link to={`/event/${id}`} className="py-4 px-1 text-gray-400 hover:text-white transition-colors">
              Event Details
            </Link>
            <Link to={`/event/${id}/bookings`} className="py-4 px-1 text-gray-400 hover:text-white transition-colors">
              Current Bookings
            </Link>
            <button className="py-4 px-1 relative text-white font-medium">
              Featured Vendors
              <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-purple-600"></motion.span>
            </button>
          </nav>
        </div>
      </div>
      <main className="p-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading featured vendors...</div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No featured vendors found for this event.</p>
            {!event?.budget && (
              <p className="text-gray-500 text-sm">Set a budget for your event to see matching vendors.</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Featured Vendors</h2>
              <p className="text-gray-400">
                Vendors whose packages best match your event budget
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendorMatch: any, index: number) => {
                const vendor = vendorMatch.vendor;
                const bestPackage = vendorMatch.bestPackage;
                const matchScore = vendorMatch.matchScore || 0;
                
                return (
                  <motion.div 
                    key={vendor.id || index} 
                    initial={{
                      y: 20,
                      opacity: 0
                    }} 
                    animate={{
                      y: 0,
                      opacity: 1
                    }} 
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1
                    }} 
                    whileHover={{
                      y: -4,
                      transition: {
                        duration: 0.2
                      }
                    }} 
                    className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-center space-x-4 p-6">
                      {vendor.mainPhotoURL ? (
                        <img 
                          src={vendor.mainPhotoURL} 
                          alt={vendor.companyName} 
                          className="w-20 h-20 rounded-lg object-cover" 
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                          {vendor.companyName?.[0] || 'V'}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{vendor.companyName || 'Vendor'}</h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {vendor.serviceType || 'Service'}
                        </p>
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <StarIcon 
                              key={star} 
                              size={16} 
                              className={`${star <= Math.floor(vendor.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-400">
                            ({vendor.rating ? vendor.rating.toFixed(1) : '0.0'})
                          </span>
                        </div>
                        {bestPackage && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Best Match Package:</p>
                            <p className="text-sm font-semibold text-purple-400">
                              {bestPackage.packageName} - {formatCurrency(bestPackage.price)}
                            </p>
                            {matchScore > 0 && (
                              <div className="mt-1">
                                <div className="flex items-center">
                                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-purple-600 h-2 rounded-full transition-all"
                                      style={{ width: `${Math.min(100, matchScore)}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-xs text-gray-400">
                                    {Math.round(matchScore)}% match
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex space-x-3">
                      <Link 
                        to={`/vendor/${vendor.id}`} 
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
                      >
                        View Profile
                      </Link>
                      <button 
                        onClick={() => handleContactVendor(vendor.id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </motion.div>;
};