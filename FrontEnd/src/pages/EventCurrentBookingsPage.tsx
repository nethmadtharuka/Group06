import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon } from 'lucide-react';
import { contractAPI, eventAPI } from '../services/api';

export const EventCurrentBookingsPage = () => {
  const { id } = useParams();
  const [contracts, setContracts] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          // Load event details
          const eventData = await eventAPI.getEventById(id);
          setEvent(eventData);

          // Load contracts for this event
          const eventContracts = await contractAPI.getContractsByEvent(id);
          
          // Remove duplicates based on contract ID
          if (eventContracts && Array.isArray(eventContracts)) {
            const seenIds = new Set<string>();
            const uniqueContracts = eventContracts.filter((contract: any) => {
              if (!contract.id) return false; // Skip contracts without IDs
              if (seenIds.has(contract.id)) {
                return false; // Skip duplicates
              }
              seenIds.add(contract.id);
              return true;
            });
            setContracts(uniqueContracts);
          } else {
            setContracts([]);
          }
        } catch (error) {
          console.error('Error loading bookings:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [id]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'Rs. 0.00';
    return 'Rs. ' + new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (signed: boolean | undefined) => {
    if (signed) return 'bg-green-600';
    return 'bg-yellow-600';
  };

  const getStatusText = (signed: boolean | undefined) => {
    if (signed) return 'Confirmed';
    return 'Pending';
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
          {event && (
            <>
              <span className="bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full mb-4 inline-block event-status-badge">
                {event.status || 'EVENT'}
              </span>
              <h1 
                className="text-5xl font-bold event-title-interactive"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                {event.name ? (
                  event.name.split(' ').map((word: string, index: number) => (
                    <span key={index} className="inline-block event-title-word mr-2">
                      {word}
                    </span>
                  ))
                ) : (
                  'Event'
                )}
              </h1>
            </>
          )}
        </div>
      </div>
      <div className="border-b border-gray-800">
        <div className="px-8">
          <nav className="flex space-x-8">
            <Link to={`/event/${id}`} className="py-4 px-1 relative event-tab text-gray-400">
              Event Details
            </Link>
            <button className="py-4 px-1 relative event-tab text-white font-medium">
              Current Bookings
              <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-purple-600"></motion.span>
            </button>
            <Link to={`/event/${id}/vendors`} className="py-4 px-1 relative event-tab text-gray-400">
              Featured Vendors
            </Link>
          </nav>
        </div>
      </div>
      <main className="p-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading bookings...</div>
        ) : (
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Contract ID
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Vendor
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Client
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Created Date
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Total Fee
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 px-6 text-center text-gray-400">
                        No contracts found for this event.
                      </td>
                    </tr>
                  ) : (
                    contracts.map((contract: any, index: number) => {
                      // Ensure we have a unique key
                      const uniqueKey = contract.id ? `contract-${contract.id}` : `contract-${index}-${contract.createdAt}`;
                      return (
                      <motion.tr
                        key={uniqueKey}
                        initial={{
                          opacity: 0,
                          y: 10
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05
                        }}
                        className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-300 font-mono text-sm">
                          #{contract.id?.substring(0, 8) || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-white">
                          {contract.vendor?.companyName || contract.vendor?.serviceType || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {contract.clientName || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {formatDate(contract.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-white font-medium">
                          {formatCurrency(contract.totalFee)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`${getStatusColor(contract.signed)} text-white text-xs font-semibold py-1 px-3 rounded-full`}>
                            {getStatusText(contract.signed)}
                          </span>
                        </td>
                      </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
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