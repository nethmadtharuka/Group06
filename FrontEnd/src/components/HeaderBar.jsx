import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Users, Store, FileText, MessageSquare, Clock, Info, Phone, User, Trash2, CreditCard } from 'lucide-react';
import { auth, userAPI } from '../services/api';

const HeaderBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const u = auth.getUser();
    if (u) setUser(u);
  }, []);

  const navigation = [
    { name: 'Vendors', path: '/vendors', icon: Store },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Contracts', path: '/contracts', icon: FileText },
    { name: 'Chatbot', path: '/chatbot', icon: MessageSquare },
    { name: 'Calendar', path: '/calendar', icon: Clock },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Payment', path: '/payment', icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EventCraft</h1>
              <p className="text-xs text-gray-500">Event Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {/* end navigation */}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            {/** Show Login/Signup when not logged in, otherwise Logout */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-700">{user.fullName || user.name || user.id}</div>
                    <button
                      onClick={() => setShowProfile(!showProfile)}
                      className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                      aria-label="Open profile"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </div>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                      <div className="text-sm text-gray-900 font-semibold">{user.fullName || user.name}</div>
                      <div className="text-xs text-gray-600">{user.email}</div>
                      {user.phone && <div className="text-xs text-gray-600">{user.phone}</div>}
                      <div className="mt-3 space-y-2">
                        <button
                          onClick={async () => {
                            try {
                              const id = user.id || user._id;
                              if (id) await userAPI.delete(id);
                            } catch (err) {
                              console.error('Failed to delete profile', err);
                            } finally {
                              auth.clearAuth();
                              setUser(null);
                              setShowProfile(false);
                              navigate('/');
                            }
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            auth.clearAuth();
                            setUser(null);
                            setShowProfile(false);
                            navigate('/');
                          }}
                          className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-teal-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="grid grid-cols-1 gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-700">
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
