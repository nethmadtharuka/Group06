import React, { useState, useEffect } from 'react';
import { contractAPI, userAPI, vendorAPI, eventAPI, auth } from '../services/api';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import { Plus, FileText, User, Store, Calendar } from 'lucide-react';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    vendorId: '',
    eventId: '',
    details: ''
  });

  useEffect(() => {
    const u = auth.getUser();
    if (u && (u.id || u._id)) setFormData(fd => ({ ...fd, userId: u.id || u._id }));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contractsData, usersData, vendorsData, eventsData] = await Promise.all([
        contractAPI.getAll(),
        userAPI.getAll(),
        vendorAPI.getAll(),
        eventAPI.getAll()
      ]);
      setContracts(contractsData);
      setUsers(usersData);
      setVendors(vendorsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.getUser();
      const payload = { ...formData, userId: formData.userId || (user && (user.id || user._id)) };
        await contractAPI.create(payload);
      setFormData({ userId: '', vendorId: '', eventId: '', details: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create contract:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.fullName : 'Unknown User';
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => (v._id === vendorId) || (v.id === vendorId));
    return vendor ? `${vendor.companyName}${vendor.serviceType ? ' — ' + vendor.serviceType : ''}` : 'Unknown Vendor';
  };

  const getEventTitle = (eventId) => {
    const event = events.find(e => e._id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
            <p className="text-gray-600">Manage contracts between users, vendors, and events</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Contract</span>
          </button>
        </div>

        {/* Create Contract Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Create New Contract</h2>
              <form onSubmit={handleSubmit}>
                {/* Use logged-in user id for contract; no selection required */}
                {formData.userId && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Creating contract as (user id)</label>
                    <div className="px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700">{formData.userId}</div>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <select
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select a vendor</option>
                    {vendors.map((vendor) => {
                      const vid = vendor.id || vendor._id;
                      const label = `${vendor.companyName}${vendor.serviceType ? ' — ' + vendor.serviceType : ''}`;
                      return (
                        <option key={vid} value={vid}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                  <select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Details</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe the contract terms and conditions..."
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
                  >
                    Create Contract
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract._id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Contract Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>{getUserName(contract.userId)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Store className="h-4 w-4 mr-2" />
                      <span>{getVendorName(contract.vendorId)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{getEventTitle(contract.eventId)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {contract.details}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(contract.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {contracts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
            <p className="text-gray-600">Get started by creating your first contract.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsPage;
