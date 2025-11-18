import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, UserCircleIcon, MessageCircleIcon } from 'lucide-react';
import { notificationAPI } from '../services/api';

export const Header = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const data = await notificationAPI.getUnreadCount(userId);
          setUnreadCount((data as any).count || 0);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error loading unread count:', error);
          }
        }
      }
    };
    loadUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const isMessagesPage = location.pathname.startsWith('/messages');
  const isVendorsPage = location.pathname.startsWith('/vendors');
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <>
      <header className={`flex items-center justify-between px-6 py-4 header-container ${isMessagesPage || isVendorsPage || isProfilePage ? 'bg-[#0a0a0f] border-b border-gray-800' : 'bg-transparent backdrop-blur-sm'}`}>
        <Link to="/" className="flex items-center header-logo-link">
          <img src="/LOGO.png" alt="EventCraft Logo" className="h-12 w-auto header-logo" />
        </Link>
        <nav className="hidden md:flex space-x-8 header-nav">
          <Link 
            to="/dashboard" 
            className={`header-nav-link ${isActive('/dashboard') ? 'header-nav-link-active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/events" 
            className={`header-nav-link ${isActive('/events') ? 'header-nav-link-active' : ''}`}
          >
            My Events
          </Link>
          <Link 
            to="/vendors" 
            className={`header-nav-link ${isActive('/vendors') ? 'header-nav-link-active' : ''}`}
          >
            Vendors
          </Link>
          <Link 
            to="/messages" 
            className={`header-nav-link ${isActive('/messages') ? 'header-nav-link-active' : ''}`}
          >
            Chats
          </Link>
        </nav>
        <div className="flex items-center space-x-4 header-actions">
          <Link 
            to="/messages" 
            className="p-2 rounded-full md:hidden header-mobile-chat-button"
            title="Chats"
          >
            <MessageCircleIcon size={20} className="text-white" />
          </Link>
          <Link 
            to="/notifications" 
            className="p-2 rounded-full relative header-notification-button"
            title="Notifications"
          >
            <BellIcon size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center header-notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <Link 
            to="/profile" 
            className="w-8 h-8 rounded-full bg-[#e8c4a3] flex items-center justify-center text-white cursor-pointer header-profile-button"
            title="Profile"
          >
            <UserCircleIcon size={20} className="text-white" />
          </Link>
        </div>
      </header>
      <style>{`
        .header-container {
          transition: all 0.3s ease;
        }
        .header-logo-link {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .header-logo-link:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .header-logo {
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        .header-logo-link:hover .header-logo {
          filter: drop-shadow(0 4px 12px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
        }
        .header-nav-link {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          padding: 0.5rem 0;
          color: white;
        }
        .header-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #a78bfa, #8b5cf6);
          transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .header-nav-link:hover {
          color: #a78bfa;
          transform: translateY(-2px);
        }
        .header-nav-link:hover::after {
          width: 100%;
        }
        .header-nav-link-active {
          color: #a78bfa;
          font-weight: 600;
        }
        .header-nav-link-active::after {
          width: 100%;
        }
        .header-mobile-chat-button,
        .header-notification-button,
        .header-profile-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .header-mobile-chat-button:hover,
        .header-notification-button:hover {
          transform: scale(1.15) rotate(10deg);
          background: rgba(139, 92, 246, 0.2);
        }
        .header-notification-badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .header-notification-button:hover .header-notification-badge {
          transform: scale(1.2) rotate(10deg);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        .header-profile-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          pointer-events: auto;
          z-index: 10;
        }
        .header-profile-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }
        .header-profile-button:hover::before {
          width: 100%;
          height: 100%;
        }
        .header-profile-button:hover {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </>
  );
};