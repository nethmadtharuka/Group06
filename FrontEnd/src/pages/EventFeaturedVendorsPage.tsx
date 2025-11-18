import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, StarIcon, DollarSignIcon } from 'lucide-react';
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
  }} className="flex flex-col min-h-screen bg-transparent w-full text-white relative">
      <div className="relative h-96">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=1200")'
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0f]"></div>
        </div>
        <div className="absolute top-6 left-6 z-20">
          <Link to={`/event/${id}`} className="inline-flex items-center space-x-2 event-back-button-glass">
            <ChevronLeftIcon size={20} />
            <span>Back to Event</span>
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
          {event?.budget && (
            <p className="text-gray-300 mt-2 flex items-center event-budget">
              <DollarSignIcon size={20} className="mr-1" />
              Budget: {formatCurrency(event.budget)}
            </p>
          )}
        </div>
      </div>
      <div className="border-b border-gray-800">
        <div className="px-8">
          <nav className="flex space-x-8">
            <Link to={`/event/${id}`} className="py-4 px-1 relative event-tab text-gray-400">
              Event Details
            </Link>
            <Link to={`/event/${id}/bookings`} className="py-4 px-1 relative event-tab text-gray-400">
              Current Bookings
            </Link>
            <button className="py-4 px-1 relative event-tab text-white font-medium">
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
        .event-budget {
          transition: all 0.3s ease;
        }
        .event-budget:hover {
          color: #c4b5fd;
          transform: translateX(4px);
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
      `}</style>
    </motion.div>;
};