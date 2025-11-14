import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon } from 'lucide-react';
import { Header } from '../components/Header';
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
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
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
          {event && (
            <>
              <span className="bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full mb-4 inline-block">
                {event.status || 'EVENT'}
              </span>
              <h1 className="text-5xl font-bold">{event.name || 'Event'}</h1>
            </>
          )}
        </div>
      </div>
      <div className="border-b border-gray-800">
        <div className="px-8">
          <nav className="flex space-x-8">
            <Link to={`/event/${id}`} className="py-4 px-1 text-gray-400 hover:text-white transition-colors">
              Event Details
            </Link>
            <button className="py-4 px-1 relative text-white font-medium">
              Current Bookings
              <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-purple-600"></motion.span>
            </button>
            <Link to={`/event/${id}/vendors`} className="py-4 px-1 text-gray-400 hover:text-white transition-colors">
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
    </motion.div>;
};