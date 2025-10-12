import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, auth } from '../services/api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build payload as required by your backend
      const payload = {
        username: username || email.split('@')[0],
        email,
        password,
        fullName,
        phone: phone || null,
        role: 'CUSTOMER'
      };

      const res = await userAPI.register(payload);
      // response example contains id
      if (res && (res.id || res._id)) {
        const id = res.id || res._id;
        auth.saveAuth({ token: null, user: { id } });
        navigate('/');
      } else {
        // fallback to previous behavior
        if (res && (res.token || res.user)) {
          const token = res.token || res.accessToken || null;
          const user = res.user || (res.id ? { id: res.id } : (res._id ? { id: res._id } : null));
          auth.saveAuth({ token, user });
          navigate('/');
        } else {
          alert('Registration failed');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <button className="w-full bg-teal-600 text-white py-2 rounded-md" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
