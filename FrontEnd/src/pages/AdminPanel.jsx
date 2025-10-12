import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import api from '../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [settings, setSettings] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'ADMIN') {
      alert('Access denied. Admin privileges required.');
      navigate('/login');
    }
  }, [navigate]);

  // Load data based on active tab
  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'dashboard':
          const statsRes = await api.admin.getDashboardStats();
          setStats(statsRes);
          break;
        case 'users':
          const usersRes = await api.admin.getAllUsers();
          setUsers(usersRes);
          break;
        case 'events':
          const eventsRes = await api.admin.getAllEvents();
          setEvents(eventsRes);
          break;
        case 'vendors':
          const vendorsRes = await api.admin.getAllVendors();
          setVendors(vendorsRes);
          break;
        case 'settings':
          const settingsRes = await api.admin.getSettings();
          setSettings(settingsRes);
          break;
        case 'logs':
          const logsRes = await api.admin.getLogs();
          setLogs(logsRes);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // User Management Functions
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.admin.deleteUser(userId);
        alert('User deleted successfully');
        loadTabData();
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      await api.admin.updateUser(userId, updatedData);
      alert('User updated successfully');
      setEditingUser(null);
      loadTabData();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await api.admin.updateUserRole(userId, newRole);
      alert('User role updated successfully');
      loadTabData();
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  // Event Management Functions
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.admin.deleteEvent(eventId);
        alert('Event deleted successfully');
        loadTabData();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  // Vendor Management Functions
  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await api.admin.deleteVendor(vendorId);
        alert('Vendor deleted successfully');
        loadTabData();
      } catch (error) {
        alert('Failed to delete vendor');
      }
    }
  };

  // Settings Management
  const handleUpdateSettings = async (updatedSettings) => {
    try {
      await api.admin.updateSettings(updatedSettings);
      alert('Settings updated successfully');
      loadTabData();
    } catch (error) {
      alert('Failed to update settings');
    }
  };

  // Filter function for search
  const filterData = (data, searchFields) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-4xl font-bold">{stats.totalUsers || 0}</p>
        <p className="text-sm mt-2">
          Admins: {stats.adminCount} | Vendors: {stats.vendorCount} | Customers: {stats.customerCount}
        </p>
      </div>
      
      <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Total Events</h3>
        <p className="text-4xl font-bold">{stats.totalEvents || 0}</p>
      </div>
      
      <div className="bg-purple-500 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Total Vendors</h3>
        <p className="text-4xl font-bold">{stats.totalVendors || 0}</p>
      </div>
      
      <div className="bg-orange-500 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">System Status</h3>
        <p className="text-2xl font-bold">Active</p>
        <p className="text-sm mt-2">All systems operational</p>
      </div>
    </div>
  );

  // Render Users Tab
  const renderUsers = () => {
    const filteredUsers = filterData(users, ['username', 'email', 'fullName', 'role']);
    
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <p className="text-gray-600">{filteredUsers.length} users found</p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.fullName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="VENDOR">Vendor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Events Tab
  const renderEvents = () => {
    const filteredEvents = filterData(events, ['name', 'description', 'location']);
    
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <p className="text-gray-600">{filteredEvents.length} events found</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{event.description}</p>
              <p className="text-gray-500 text-xs mb-3">
                <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-gray-500 text-xs mb-3">
                <strong>Location:</strong> {event.location || 'N/A'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Vendors Tab
  const renderVendors = () => {
    const filteredVendors = filterData(vendors, ['businessName', 'email', 'serviceType']);
    
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <p className="text-gray-600">{filteredVendors.length} vendors found</p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{vendor.businessName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vendor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vendor.serviceType || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Settings Tab
  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName || ''}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.maintenanceMode || false}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.registrationEnabled || false}
            onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Enable User Registration</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.emailNotifications || false}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Email Notifications</label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Events Per User</label>
          <input
            type="number"
            value={settings.maxEventsPerUser || 50}
            onChange={(e) => setSettings({ ...settings, maxEventsPerUser: parseInt(e.target.value) })}
            className="border rounded px-4 py-2 w-full"
          />
        </div>
        
        <button
          onClick={() => handleUpdateSettings(settings)}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );

  // Render Logs Tab
  const renderLogs = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">{log.action}</td>
              <td className="px-6 py-4 whitespace-nowrap">{log.user}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage your EventCraft platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'events', label: 'Events', icon: '📅' },
              { id: 'vendors', label: 'Vendors', icon: '🏢' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
              { id: 'logs', label: 'Activity Logs', icon: '📝' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'events' && renderEvents()}
              {activeTab === 'vendors' && renderVendors()}
              {activeTab === 'settings' && renderSettings()}
              {activeTab === 'logs' && renderLogs()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
