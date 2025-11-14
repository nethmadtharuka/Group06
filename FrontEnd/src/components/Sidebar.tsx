import React from 'react';
import { LayoutDashboardIcon, CalendarIcon, UsersIcon, StoreIcon, BarChartIcon, SettingsIcon, LogOutIcon, TicketIcon, UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
interface SidebarProps {
  type: 'admin' | 'user';
  userName?: string;
  userRole?: string;
}
export const Sidebar: React.FC<SidebarProps> = ({
  type,
  userName = 'Alex Johnson',
  userRole = 'Administrator'
}) => {
  const location = useLocation();
  const adminNavItems = [{
    icon: LayoutDashboardIcon,
    label: 'Dashboard',
    path: '/admin'
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
  return <div className="w-64 bg-[#0a0a0f] border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="text-purple-500">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8a4 4 0 100-8 4 4 0 000 8zM26 8a4 4 0 100-8 4 4 0 000 8zM26 18a4 4 0 100-8 4 4 0 000 8zM16 28a4 4 0 100-8 4 4 0 000 8zM6 18a4 4 0 100-8 4 4 0 000 8zM6 28a4 4 0 100-8 4 4 0 000 8zM26 28a4 4 0 100-8 4 4 0 000 8z" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="0.5" />
              <path d="M16 12v8M22 8l-4 4M22 24l-4-4M10 24l4-4M10 8l4 4" stroke="#8B5CF6" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-xl text-white">EventCraft</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>;
      })}
      </nav>
      {type === 'admin' && <div className="p-4 border-t border-gray-800">
          <Link to="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </div>}
      <div className="p-4 border-t border-gray-800">
        {type === 'user' && <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-4 bg-purple-600 hover:bg-purple-700 text-white transition-colors">
            <CalendarIcon size={20} />
            <span>Create Event</span>
          </button>}
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white">
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{userName}</p>
            <p className="text-gray-400 text-xs">{userRole}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full mt-2"
        >
          <LogOutIcon size={20} />
          <span>{type === 'admin' ? 'Log Out' : 'Logout'}</span>
        </button>
      </div>
    </div>;
};