import React, { useState, useEffect } from 'react';
import { vendorAPI, userAPI, auth } from '../services/api';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import { Plus, Store, MapPin, Phone, Edit, Star } from 'lucide-react';

// Modern Vendor Image Component for e-commerce style
const VendorImage = ({ imageUrl, companyName, className = "w-full h-48" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (!imageUrl || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center rounded-t-lg`}>
        <div className="text-center">
          <Store className="h-16 w-16 text-teal-400 mx-auto mb-2" />
          <p className="text-teal-600 font-medium text-sm">{companyName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-t-lg group`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Store className="h-16 w-16 text-gray-400" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={`${companyName} logo`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>
  );
};

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [myVendor, setMyVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myVendorLoading, setMyVendorLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    companyName: '',
    serviceType: '',
    address: '',
    imageUrl: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    companyName: '',
    address: '',
    imageUrl: ''
  });

  useEffect(() => {
    const u = auth.getUser();
    if (u && (u.id || u._id)) setFormData(fd => ({ ...fd, userId: u.id || u._id }));
    fetchData();
    fetchMyVendor();
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

  const fetchMyVendor = async () => {
    try {
      setMyVendorLoading(true);
      const user = auth.getUser();
      if (user && (user.id || user._id)) {
        const userId = user.id || user._id;
        const vendorData = await vendorAPI.getUserVendor(userId);
        setMyVendor(vendorData);
        // Pre-populate update form with current data
        setUpdateFormData({
          companyName: vendorData.companyName || '',
          address: vendorData.address || '',
          imageUrl: vendorData.imageUrl || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch my vendor data:', error);
      setMyVendor(null);
    } finally {
      setMyVendorLoading(false);
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
        address: formData.address,
        imageUrl: formData.imageUrl
      });
      setFormData({ userId: '', companyName: '', serviceType: '', address: '', imageUrl: '' });
      setShowForm(false);
      fetchData();
      fetchMyVendor(); // Refresh my vendor data
    } catch (error) {
      console.error('Failed to register vendor:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.getUser();
      const userId = user.id || user._id;
      await vendorAPI.updateVendor(userId, {
        companyName: updateFormData.companyName,
        address: updateFormData.address,
        imageUrl: updateFormData.imageUrl
      });
      setShowUpdateForm(false);
      fetchMyVendor(); // Refresh my vendor data
    } catch (error) {
      console.error('Failed to update vendor:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateInputChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value
    });
  };

  // URL validation function
  const isValidUrl = (string) => {
    if (!string) return true; // Empty URL is valid (optional field)
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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

        {/* My Vendors Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Vendors</h2>
          
          {myVendorLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <span className="ml-3 text-gray-600">Loading your vendor data...</span>
            </div>
          ) : myVendor ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <VendorImage 
                  imageUrl={myVendor.imageUrl} 
                  companyName={myVendor.companyName}
                  className="w-full h-48"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {myVendor.companyName}
                    </h3>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-yellow-700">{myVendor.rating || 0}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                      {myVendor.serviceType}
                    </span>
                  </div>

                  {myVendor.user && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Owner:</span> {myVendor.user.fullName || myVendor.user.username || myVendor.user.email}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{myVendor.address}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Registered: {myVendor.createdAt ? new Date(myVendor.createdAt).toLocaleDateString() : ''}
                  </div>

                  <button
                    onClick={() => setShowUpdateForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Update Profile</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't registered as vendor</h3>
              <p className="text-gray-600 mb-4">Register as a vendor to start offering your services.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Register as Vendor</span>
              </button>
            </div>
          )}
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      formData.imageUrl && !isValidUrl(formData.imageUrl) 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                  />
                  {formData.imageUrl && !isValidUrl(formData.imageUrl) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
                  )}
                </div>
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

        {/* Update Vendor Form Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Update Vendor Information</h2>
              <form onSubmit={handleUpdateSubmit}>
                <FormInput
                  label="Company Name"
                  name="companyName"
                  value={updateFormData.companyName}
                  onChange={handleUpdateInputChange}
                  required
                />
                <FormInput
                  label="Address"
                  name="address"
                  value={updateFormData.address}
                  onChange={handleUpdateInputChange}
                  required
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={updateFormData.imageUrl}
                    onChange={handleUpdateInputChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      updateFormData.imageUrl && !isValidUrl(updateFormData.imageUrl) 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                  />
                  {updateFormData.imageUrl && !isValidUrl(updateFormData.imageUrl) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Update Vendor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* All Vendors Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Vendors</h2>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id || vendor._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <VendorImage 
                imageUrl={vendor.imageUrl} 
                companyName={vendor.companyName}
                className="w-full h-48"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                    {vendor.companyName}
                  </h3>
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium text-yellow-700">{vendor.rating || 0}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="inline-block bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                    {vendor.serviceType}
                  </span>
                </div>

                {vendor.user && (
                  <div className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Owner:</span> {vendor.user.fullName || vendor.user.username || vendor.user.email}
                  </div>
                )}

                <div className="flex items-center text-xs text-gray-600 mb-3">
                  <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="line-clamp-1">{vendor.address}</span>
                </div>

                <div className="text-xs text-gray-500">
                  Registered: {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
            </div>
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
