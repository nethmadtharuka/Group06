import React, { useState, useEffect } from 'react';
import { LayoutDashboardIcon, CalendarIcon, UsersIcon, StoreIcon, BarChartIcon, SettingsIcon, LogOutIcon, TicketIcon, UserIcon, MessageSquareIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { userAPI } from '../services/api';

interface SidebarProps {
  type: 'admin' | 'user';
  userName?: string;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  type,
  userName: propUserName,
  userRole: propUserRole
}) => {
  const location = useLocation();
  const [userName, setUserName] = useState<string>('Loading...');
  const [userRole, setUserRole] = useState<string>('User');
  const [sidebarHeight, setSidebarHeight] = useState<string>('100vh');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('userId');
        const storedUserRole = localStorage.getItem('userRole');

        if (propUserName && propUserRole) {
          // Use props if provided
          setUserName(propUserName);
          setUserRole(propUserRole);
        } else if (userStr) {
          // Parse from localStorage
          try {
            const userData = JSON.parse(userStr);
            setUserName(userData.fullName || userData.username || 'User');
            setUserRole(userData.role || storedUserRole || (type === 'admin' ? 'ADMIN' : 'CUSTOMER'));
          } catch {
            // If parsing fails, try to fetch from API
            if (storedUserId) {
              const userData = await userAPI.getUserById(storedUserId);
              if (userData) {
                setUserName((userData as any).fullName || (userData as any).username || 'User');
                setUserRole((userData as any).role || storedUserRole || (type === 'admin' ? 'ADMIN' : 'CUSTOMER'));
              }
            } else {
              setUserName('User');
              setUserRole(storedUserRole || (type === 'admin' ? 'ADMIN' : 'CUSTOMER'));
            }
          }
        } else if (storedUserId) {
          // Fetch from API if we have userId
          const userData = await userAPI.getUserById(storedUserId);
          if (userData) {
            setUserName((userData as any).fullName || (userData as any).username || 'User');
            setUserRole((userData as any).role || storedUserRole || (type === 'admin' ? 'ADMIN' : 'CUSTOMER'));
          }
        } else {
          setUserName('User');
          setUserRole(storedUserRole || (type === 'admin' ? 'ADMIN' : 'CUSTOMER'));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserName('User');
        setUserRole(localStorage.getItem('userRole') || (type === 'admin' ? 'ADMIN' : 'CUSTOMER'));
      }
    };

    loadUserData();
  }, [propUserName, propUserRole, type]);

  // Update sidebar height to match page content
  useEffect(() => {
    const updateHeight = () => {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      setSidebarHeight(`${documentHeight}px`);
    };

    // Initial height
    updateHeight();

    // Update on resize and scroll
    window.addEventListener('resize', updateHeight);
    window.addEventListener('scroll', updateHeight);
    
    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Update periodically as fallback
    const interval = setInterval(updateHeight, 500);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('scroll', updateHeight);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
  const adminNavItems = [{
    icon: LayoutDashboardIcon,
    label: 'Dashboard',
    path: '/admin'
  }, {
    icon: MessageSquareIcon,
    label: 'Support Messages',
    path: '/admin/messages'
  }, {
    icon: CalendarIcon,
    label: 'Events',
    path: '/admin/events'
  }, {
    icon: UsersIcon,
    label: 'Users',
    path: '/admin/users'
  }, {
    icon: StoreIcon,
    label: 'Vendors',
    path: '/admin/vendors'
  }, {
    icon: BarChartIcon,
    label: 'Reports',
    path: '/admin/reports'
  }];
  const userNavItems = [{
    icon: LayoutDashboardIcon,
    label: 'Dashboard',
    path: '/dashboard'
  }, {
    icon: CalendarIcon,
    label: 'My Events',
    path: '/events'
  }, {
    icon: TicketIcon,
    label: 'My Bookings',
    path: '/events' // Using events page for now, can be updated later
  }, {
    icon: UserIcon,
    label: 'Profile',
    path: '/profile'
  }, {
    icon: SettingsIcon,
    label: 'Settings',
    path: '/profile' // Using profile page for settings
  }];
  const navItems = type === 'admin' ? adminNavItems : userNavItems;
  
  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'VENDOR':
        return 'Vendor';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return role || 'User';
    }
  };

  return <div className="w-64 bg-[#0a0a0f] border-r border-gray-800 flex flex-col fixed left-0 top-0 z-50" style={{ height: sidebarHeight, minHeight: '100vh' }}>
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <img src="/LOGO.png" alt="EventCraft Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl text-white">EventCraft</span>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
        return <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>;
      })}
      </nav>
      {type === 'admin' && (
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <Link 
            to="/admin/settings" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              location.pathname === '/admin/settings' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </div>
      )}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        {type === 'user' && <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-4 bg-purple-600 hover:bg-purple-700 text-white transition-colors">
            <CalendarIcon size={20} />
            <span>Create Event</span>
          </button>}
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold flex-shrink-0">
            {userName && userName !== 'Loading...' ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{userName || 'User'}</p>
            <p className="text-gray-400 text-xs truncate">{getRoleDisplayName(userRole)}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-gray-800 transition-colors w-full"
        >
          <LogOutIcon size={20} />
          <span>{type === 'admin' ? 'Log Out' : 'Logout'}</span>
        </button>
      </div>
    </div>;
};