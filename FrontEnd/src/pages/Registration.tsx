import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
export const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    username: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');
    if (userStr) {
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Generate username from email if not provided
      const username = formData.username || formData.email.split('@')[0];
      const user = await userAPI.register({
        ...formData,
        username
      });
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', (user as any).id);
      localStorage.setItem('userRole', (user as any).role || 'CUSTOMER');
      
      // Navigate based on user role
      const userRole = (user as any).role;
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else if (userRole === 'VENDOR') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="h-screen bg-transparent w-full flex relative overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" style={{
      backgroundImage: "url('/login.jpg')"
    }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="mb-6 text-center">
            <h1 
              className="text-3xl lg:text-4xl font-bold text-white mb-2 register-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block register-title-word">Create</span>{' '}
              <span className="inline-block register-title-word">Your</span>{' '}
              <span className="inline-block register-title-word">Account</span>
            </h1>
            <p 
              className="text-sm lg:text-base text-gray-400 register-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block register-subtitle-phrase">Join EventCraft</span>{' '}
              <span className="inline-block register-subtitle-phrase">and craft your next event experience.</span>
            </p>
          </div>
          <div className="space-y-2 lg:space-y-2.5 mb-4">
            <button className="w-full flex items-center justify-center space-x-2 lg:space-x-3 bg-gray-800 hover:bg-gray-700 text-white py-2 lg:py-2.5 px-4 rounded-lg register-social-button text-sm lg:text-base">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 register-social-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 lg:space-x-3 bg-gray-800 hover:bg-gray-700 text-white py-2 lg:py-2.5 px-4 rounded-lg register-social-button text-sm lg:text-base">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 register-social-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>
          <div className="relative my-4 lg:my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs lg:text-sm">
              <span className="px-2 bg-[#0a0a0f] text-gray-400">OR</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
            <div className="register-input-group">
              <label className="block text-white mb-1 text-sm register-label">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                className="w-full px-3 py-2 lg:px-4 lg:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-input text-sm" 
              />
            </div>
            <div className="register-input-group">
              <label className="block text-white mb-1 text-sm register-label">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-3 py-2 lg:px-4 lg:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-input text-sm" 
              />
            </div>
            <div className="register-input-group">
              <label className="block text-white mb-1 text-sm register-label">Username (optional)</label>
              <input 
                type="text" 
                placeholder="Enter username" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 lg:px-4 lg:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-input text-sm" 
              />
            </div>
            <div className="register-input-group">
              <label className="block text-white mb-1 text-sm register-label">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full px-3 py-2 lg:px-4 lg:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-input text-sm" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white register-eye-button">
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="terms" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500 register-checkbox" />
              <label htmlFor="terms" className="text-xs lg:text-sm text-gray-400">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-purple-500 hover:text-purple-400 register-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-500 hover:text-purple-400 register-link">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-2.5 lg:py-3 px-4 rounded-lg font-medium register-submit-button text-sm lg:text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-400 mt-4 lg:mt-5 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium register-login-link">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        .register-title-interactive {
          transition: all 0.3s ease;
        }
        .register-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .register-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #a78bfa;
          text-shadow: 0 8px 24px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .register-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .register-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: default;
        }
        .register-subtitle-phrase:hover {
          transform: translateY(-3px) scale(1.05);
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.15);
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .register-input-group {
          transition: all 0.3s ease;
        }
        .register-input-group:hover .register-label {
          color: #c4b5fd;
          transform: translateX(4px);
        }
        .register-label {
          transition: all 0.3s ease;
        }
        .register-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .register-input:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-1px);
        }
        .register-eye-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-eye-button:hover {
          transform: translateY(-50%) scale(1.2) rotate(5deg);
          color: #a78bfa;
        }
        .register-checkbox {
          transition: all 0.3s ease;
        }
        .register-checkbox:hover {
          transform: scale(1.1);
        }
        .register-link {
          transition: all 0.3s ease;
          position: relative;
        }
        .register-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(167, 139, 250, 0.8));
          transition: width 0.3s ease;
        }
        .register-link:hover::after {
          width: 100%;
        }
        .register-link:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
        .register-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .register-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .register-submit-button:hover:not(:disabled)::before {
          left: 100%;
        }
        .register-submit-button:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .register-submit-button:active:not(:disabled) {
          transform: translateY(-2px) scale(1);
        }
        .register-social-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .register-social-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }
        .register-social-button:hover::before {
          left: 100%;
        }
        .register-social-button:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 16px rgba(139, 92, 246, 0.2);
        }
        .register-social-icon {
          transition: all 0.3s ease;
        }
        .register-social-button:hover .register-social-icon {
          transform: scale(1.2) rotate(5deg);
        }
        .register-login-link {
          transition: all 0.3s ease;
          position: relative;
        }
        .register-login-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(167, 139, 250, 0.8));
          transition: width 0.3s ease;
        }
        .register-login-link:hover::after {
          width: 100%;
        }
        .register-login-link:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
      `}</style>
    </div>;
};