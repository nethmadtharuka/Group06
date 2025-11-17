import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MapPinIcon, DollarSignIcon, EyeIcon, UserIcon } from 'lucide-react';
import { eventAPI } from '../services/api';

export const AdminEventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Date TBD';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return dateStr || 'Date TBD';
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

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/events')}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon size={20} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Event Details</h1>
          </div>
        </header>
        <main className="p-8">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading event details...</div>
          ) : event ? (
            <div className="max-w-4xl">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{event.name || 'N/A'}</h2>
                    <span className="inline-block bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full">
                      {event.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                {event.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{event.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon size={24} className="text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Start Date & Time</h3>
                      <p className="text-gray-400">{formatDate(event.startDate)}</p>
                    </div>
                  </div>

                  {event.endDate && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ClockIcon size={24} className="text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">End Date & Time</h3>
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
                        <h3 className="font-medium text-white mb-1">Location</h3>
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
                        <h3 className="font-medium text-white mb-1">Budget</h3>
                        <p className="text-gray-400">{formatCurrency(event.budget)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <EyeIcon size={24} className="text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Status</h3>
                      <p className="text-gray-400">{event.status || 'PENDING'}</p>
                    </div>
                  </div>

                  {event.user && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserIcon size={24} className="text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Event Owner</h3>
                        <p className="text-gray-400">
                          {event.user.fullName || event.user.username || 'N/A'}
                        </p>
                        {event.user.email && (
                          <p className="text-gray-500 text-sm mt-1">{event.user.email}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {event.createdAt && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-gray-500 text-sm">
                      Created: {formatDate(event.createdAt)}
                    </p>
                    {event.updatedAt && event.updatedAt !== event.createdAt && (
                      <p className="text-gray-500 text-sm mt-1">
                        Last Updated: {formatDate(event.updatedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">Event not found</div>
          )}
        </main>
      </div>
    </div>
  );
};

