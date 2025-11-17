import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email/username and password');
      return;
    }
    
    setLoading(true);

    try {
      const user = await userAPI.login(email.trim(), password);
      
      if (!user || !(user as any).id) {
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', (user as any).id);
      localStorage.setItem('userRole', (user as any).role || 'CUSTOMER');
      
      // Navigate based on user role
      const userRole = (user as any).role;
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else if (userRole === 'VENDOR') {
        navigate('/dashboard'); // or /vendor/manage if preferred
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
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
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <img src="/LOGO.png" alt="EventCraft Logo" className="h-28 lg:h-32 w-auto login-logo-interactive" />
            </div>
            <h1 
              className="text-3xl lg:text-4xl font-bold text-white mb-1 login-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block login-title-word">Welcome</span>{' '}
              <span className="inline-block login-title-word">Back</span>
            </h1>
            <p 
              className="text-sm lg:text-base text-gray-400 login-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block login-subtitle-phrase">Log in to manage your events</span>{' '}
              <span className="inline-block login-subtitle-phrase">and connect with your audience.</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="login-input-group">
              <label className="block text-white mb-1 text-sm login-label">Email Address or Username</label>
              <input 
                type="text" 
                placeholder="Enter your email or username" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 lg:px-4 lg:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 login-input text-sm" 
              />
            </div>
            <div className="login-input-group">
              <label className="block text-white mb-1 text-sm login-label">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 lg:px-4 lg:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 login-input text-sm" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white login-eye-button">
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-purple-500 hover:text-purple-400 text-xs lg:text-sm login-forgot-link">
                Forgot Password?
              </Link>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-2.5 lg:py-3 px-4 rounded-lg font-medium login-submit-button text-sm lg:text-base"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="relative my-4 lg:my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs lg:text-sm">
              <span className="px-2 bg-[#0a0a0f] text-gray-400">OR</span>
            </div>
          </div>
          <div className="space-y-2 lg:space-y-2.5">
            <button className="w-full flex items-center justify-center space-x-2 lg:space-x-3 bg-gray-800 hover:bg-gray-700 text-white py-2 lg:py-2.5 px-4 rounded-lg login-social-button text-sm lg:text-base">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 login-social-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Log in with Google</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 lg:space-x-3 bg-gray-800 hover:bg-gray-700 text-white py-2 lg:py-2.5 px-4 rounded-lg login-social-button text-sm lg:text-base">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 login-social-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Log in with Facebook</span>
            </button>
          </div>
          <p className="text-center text-gray-400 mt-4 lg:mt-5 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-500 hover:text-purple-400 font-medium login-signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        .login-logo-interactive {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .login-logo-interactive:hover {
          transform: scale(1.1) translateY(-4px) rotate(2deg);
          filter: drop-shadow(0 8px 24px rgba(139, 92, 246, 0.5));
        }
        .login-title-interactive {
          transition: all 0.3s ease;
        }
        .login-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .login-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #a78bfa;
          text-shadow: 0 8px 24px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .login-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .login-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: default;
        }
        .login-subtitle-phrase:hover {
          transform: translateY(-3px) scale(1.05);
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.15);
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .login-input-group {
          transition: all 0.3s ease;
        }
        .login-input-group:hover .login-label {
          color: #c4b5fd;
          transform: translateX(4px);
        }
        .login-label {
          transition: all 0.3s ease;
        }
        .login-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .login-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .login-input:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-1px);
        }
        .login-eye-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .login-eye-button:hover {
          transform: translateY(-50%) scale(1.2) rotate(5deg);
          color: #a78bfa;
        }
        .login-forgot-link {
          transition: all 0.3s ease;
          position: relative;
        }
        .login-forgot-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(167, 139, 250, 0.8));
          transition: width 0.3s ease;
        }
        .login-forgot-link:hover::after {
          width: 100%;
        }
        .login-forgot-link:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
        .login-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .login-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .login-submit-button:hover:not(:disabled)::before {
          left: 100%;
        }
        .login-submit-button:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .login-submit-button:active:not(:disabled) {
          transform: translateY(-2px) scale(1);
        }
        .login-social-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .login-social-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }
        .login-social-button:hover::before {
          left: 100%;
        }
        .login-social-button:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 16px rgba(139, 92, 246, 0.2);
        }
        .login-social-icon {
          transition: all 0.3s ease;
        }
        .login-social-button:hover .login-social-icon {
          transform: scale(1.2) rotate(5deg);
        }
        .login-signup-link {
          transition: all 0.3s ease;
          position: relative;
        }
        .login-signup-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(167, 139, 250, 0.8));
          transition: width 0.3s ease;
        }
        .login-signup-link:hover::after {
          width: 100%;
        }
        .login-signup-link:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
      `}</style>
    </div>;
};