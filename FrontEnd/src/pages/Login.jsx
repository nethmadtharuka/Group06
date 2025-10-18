import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, auth } from '../services/api';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userAPI.login({ usernameOrEmail, password });
      console.log('Login response:', res); // Debug log
      
      // The backend returns the full User object directly
      if (res && res.id) {
        // Remove password from user object for security
        const userData = {
          id: res.id,
          username: res.username,
          email: res.email,
          fullName: res.fullName,
          phone: res.phone,
          role: res.role,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt
        };
        
        console.log('User data to store:', userData); // Debug log
        auth.saveAuth({ token: null, user: userData });
        
        // Store userId separately for easier access
        localStorage.setItem('userId', userData.id);
        
        // Redirect based on user role
        if (userData.role === 'ADMIN') {
          console.log('Admin user detected, redirecting to admin panel');
          navigate('/admin');
        } else {
          console.log('Regular user, redirecting to home');
          navigate('/');
        }
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
            <input value={usernameOrEmail} onChange={e => setUsernameOrEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="mb-4 text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-teal-600 hover:text-teal-800 underline"
            >
              Forgot Password?
            </button>
          </div>
          <button className="w-full bg-teal-600 text-white py-2 rounded-md" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
