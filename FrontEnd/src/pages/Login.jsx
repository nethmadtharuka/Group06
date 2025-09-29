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
      // expect response like { token, user: { id|_id, fullName, ... } }
      if (res && (res.token || res.user)) {
        const token = res.token || res.accessToken || null;
        const user = res.user || (res.id ? { id: res.id } : (res._id ? { id: res._id } : null));
        auth.saveAuth({ token, user });
        navigate('/');
      } else if (res && (res.id || res._id)) {
        // response contains user object with id
        const id = res.id || res._id;
        auth.saveAuth({ token: null, user: { id, fullName: res.fullName, username: res.username, email: res.email } });
        navigate('/');
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
          <button className="w-full bg-teal-600 text-white py-2 rounded-md" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
