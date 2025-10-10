import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import BackButton from '../components/BackButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await userAPI.forgotPassword(email);
      setSuccess(true);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage('Failed to send password reset email. Please check if the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Sent!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
              >
                Back to Login
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                  setMessage('');
                }}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Send Another Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <BackButton />
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {message && (
          <div className={`mb-4 p-4 rounded-md ${success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-teal-600 hover:text-teal-800 underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;