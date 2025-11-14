import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, UserCircleIcon, MessageCircleIcon } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return <header className="flex items-center justify-between px-6 py-4 bg-[#0a0a0f] border-b border-gray-800">
      <Link to="/" className="flex items-center space-x-2">
        <div className="text-purple-500">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8a4 4 0 100-8 4 4 0 000 8zM26 8a4 4 0 100-8 4 4 0 000 8zM26 18a4 4 0 100-8 4 4 0 000 8zM16 28a4 4 0 100-8 4 4 0 000 8zM6 18a4 4 0 100-8 4 4 0 000 8zM6 28a4 4 0 100-8 4 4 0 000 8zM26 28a4 4 0 100-8 4 4 0 000 8z" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="0.5" />
            <path d="M16 12v8M22 8l-4 4M22 24l-4-4M10 24l4-4M10 8l4 4" stroke="#8B5CF6" strokeWidth="2" />
          </svg>
        </div>
        <span className="font-bold text-xl text-white">EventCraft</span>
      </Link>
      <nav className="hidden md:flex space-x-8">
        <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors">
          Dashboard
        </Link>
        <Link to="/events" className="text-gray-400 hover:text-purple-400 transition-colors">
          My Events
        </Link>
        <Link to="/vendors" className="text-gray-400 hover:text-purple-400 transition-colors">
          Vendors
        </Link>
        <Link to="/messages" className="text-gray-400 hover:text-purple-400 transition-colors">
          Chats
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Link 
          to="/messages" 
          className="p-2 rounded-full hover:bg-gray-800 transition-colors md:hidden"
          title="Chats"
        >
          <MessageCircleIcon size={20} className="text-white" />
        </Link>
        <button className="p-2 rounded-full hover:bg-gray-800">
          <BellIcon size={20} className="text-white" />
        </button>
        <button 
          onClick={handleProfileClick}
          className="w-8 h-8 rounded-full bg-[#e8c4a3] flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer"
        >
          <UserCircleIcon size={20} className="text-white" />
        </button>
      </div>
    </header>;
};