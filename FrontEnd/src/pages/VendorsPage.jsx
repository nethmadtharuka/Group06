import React, { useState, useEffect } from 'react';
import { vendorAPI, userAPI, auth } from '../services/api';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import { Plus, Store, MapPin, Phone } from 'lucide-react';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    companyName: '',
    serviceType: '',
    address: ''
  });

  useEffect(() => {
    const u = auth.getUser();
    if (u && (u.id || u._id)) setFormData(fd => ({ ...fd, userId: u.id || u._id }));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vendorsData, usersData] = await Promise.all([
        vendorAPI.getAll(),
        userAPI.getAll()
      ]);
      setVendors(vendorsData);
      setUsers(usersData);
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
      const userIdToUse = formData.userId || (user && (user.id || user._id));
      await vendorAPI.register(userIdToUse, {
        companyName: formData.companyName,
        serviceType: formData.serviceType,
        address: formData.address
      });
      setFormData({ userId: '', companyName: '', serviceType: '', address: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to register vendor:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600">Manage vendor registrations and services</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Register Vendor</span>
          </button>
        </div>

        {/* Register Vendor Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Register New Vendor</h2>
              <form onSubmit={handleSubmit}>
                {/* Use logged-in user id; no user selection required */}
                {formData.userId && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registering as (user id)</label>
                    <div className="px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700">{formData.userId}</div>
                  </div>
                )}
                <FormInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Service Type"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  placeholder="e.g., Catering, Photography, Music"
                  required
                />
                <FormInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
                  >
                    Register Vendor
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

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor.id || vendor._id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Store className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{vendor.companyName}</h3>
                  <p className="text-sm text-teal-600 font-medium mb-2">{vendor.serviceType}</p>
                  {vendor.user && (
                    <div className="text-sm text-gray-600 mb-2">By: {vendor.user.fullName || vendor.user.username || vendor.user.email}</div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{vendor.address}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Registered: {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {vendors.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Get started by registering your first vendor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
