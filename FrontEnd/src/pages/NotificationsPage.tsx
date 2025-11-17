import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import {
  BellRingIcon,
  TrophyIcon,
  FileTextIcon,
  MessageSquareIcon,
  DollarSignIcon,
  CheckIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { notificationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'EVENT' | 'CONTRACT' | 'MESSAGE' | 'PAYMENT' | 'SYSTEM';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<
    'all' | 'unread' | 'events' | 'contracts' | 'messages'
  >('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          if (import.meta.env.DEV) {
            console.warn('No userId found in localStorage');
          }
          setNotifications([]);
          setLoading(false);
          return;
        }
        
        const data = await notificationAPI.getNotifications(userId);
        if (import.meta.env.DEV) {
          console.log('Notifications data received:', data);
        }
        
        // Transform backend data to frontend format
        const transformed = (Array.isArray(data) ? data : []).map((n: any) => {
          try {
            return {
              id: n.id || n._id || '',
              type: (n.type || 'SYSTEM').toString(),
              title: n.title || 'Notification',
              description: n.description || n.message || '',
              timestamp: n.createdAt ? new Date(n.createdAt) : new Date(),
              read: n.read === true || n.read === 'true',
              actionUrl: n.actionUrl || n.url || undefined,
            };
          } catch (err) {
            if (import.meta.env.DEV) {
              console.error('Error transforming notification:', err, n);
            }
            return null;
          }
        }).filter((n): n is Notification => n !== null);
        
        if (import.meta.env.DEV) {
          console.log('Transformed notifications:', transformed);
        }
        setNotifications(transformed);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading notifications:', error);
        }
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EVENT':
        return TrophyIcon;
      case 'CONTRACT':
        return FileTextIcon;
      case 'MESSAGE':
        return MessageSquareIcon;
      case 'PAYMENT':
        return DollarSignIcon;
      default:
        return BellRingIcon;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'EVENT':
        return 'bg-blue-600 bg-opacity-20 text-blue-500';
      case 'CONTRACT':
        return 'bg-purple-600 bg-opacity-20 text-purple-500';
      case 'MESSAGE':
        return 'bg-green-600 bg-opacity-20 text-green-500';
      case 'PAYMENT':
        return 'bg-yellow-600 bg-opacity-20 text-yellow-500';
      default:
        return 'bg-gray-600 bg-opacity-20 text-gray-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const groupNotifications = (notifs: Notification[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as Notification[],
      thisWeek: [] as Notification[],
      earlier: [] as Notification[],
    };

    notifs.forEach((notif) => {
      if (notif.timestamp >= today) {
        groups.today.push(notif);
      } else if (notif.timestamp >= weekAgo) {
        groups.thisWeek.push(notif);
      } else {
        groups.earlier.push(notif);
      }
    });

    return groups;
  };

  const filterNotifications = () => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter === 'events') {
      filtered = filtered.filter((n) => n.type === 'EVENT');
    } else if (filter === 'contracts') {
      filtered = filtered.filter((n) => n.type === 'CONTRACT');
    } else if (filter === 'messages') {
      filtered = filtered.filter((n) => n.type === 'MESSAGE');
    }

    return filtered;
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n,
        ),
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await notificationAPI.markAllAsRead(userId);
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            read: true,
          })),
        );
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error marking all as read:', error);
      }
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const filteredNotifications = filterNotifications();
  const groupedNotifications = groupNotifications(filteredNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full relative z-10">
      <Header />
      <main className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Notifications
              </h1>
              <p className="text-gray-400">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                  : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <CheckIcon size={16} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
          <div className="flex space-x-2 border-b border-gray-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors ${filter === 'all' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 font-medium transition-colors ${filter === 'unread' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Unread{' '}
              {unreadCount > 0 && (
                <span className="ml-1 text-xs">({unreadCount})</span>
              )}
            </button>
            <button
              onClick={() => setFilter('events')}
              className={`px-4 py-2 font-medium transition-colors ${filter === 'events' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('contracts')}
              className={`px-4 py-2 font-medium transition-colors ${filter === 'contracts' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Contracts
            </button>
            <button
              onClick={() => setFilter('messages')}
              className={`px-4 py-2 font-medium transition-colors ${filter === 'messages' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Messages
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <BellRingIcon size={64} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-400">
              {filter === 'unread'
                ? "You're all caught up!"
                : 'No notifications to display'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedNotifications.today.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Today</h2>
                <div className="space-y-3">
                  {groupedNotifications.today.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                        }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`bg-gray-800 bg-opacity-50 border rounded-lg p-4 cursor-pointer transition-all ${notification.read ? 'border-gray-700 hover:border-gray-600' : 'border-purple-500 hover:border-purple-400'}`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          >
                            <Icon size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-white font-semibold">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {notification.description}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {groupedNotifications.thisWeek.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">This Week</h2>
                <div className="space-y-3">
                  {groupedNotifications.thisWeek.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                        }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`bg-gray-800 bg-opacity-50 border rounded-lg p-4 cursor-pointer transition-all ${notification.read ? 'border-gray-700 hover:border-gray-600' : 'border-purple-500 hover:border-purple-400'}`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          >
                            <Icon size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-white font-semibold">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {notification.description}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {groupedNotifications.earlier.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Earlier</h2>
                <div className="space-y-3">
                  {groupedNotifications.earlier.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                        }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`bg-gray-800 bg-opacity-50 border rounded-lg p-4 cursor-pointer transition-all ${notification.read ? 'border-gray-700 hover:border-gray-600' : 'border-purple-500 hover:border-purple-400'}`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          >
                            <Icon size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-white font-semibold">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {notification.description}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

