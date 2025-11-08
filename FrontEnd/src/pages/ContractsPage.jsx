import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { 
  FileText, 
  Plus, 
  Eye, 
  Trash2, 
  Clock, 
  User, 
  Building2,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Send,
  Edit,
  X,
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { contractAPI, vendorAPI, eventAPI, auth } from '../services/api';

const ContractsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    contractText: '',
    eventId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = auth.getUser();
    console.log('ContractsPage - Current user:', currentUser); // Debug log
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    console.log('ContractsPage - User ID:', currentUser.id); // Debug log
    loadData(currentUser.id);
  }, [navigate]);

  const loadData = async (userId) => {
    try {
      setLoading(true);
      const [contractsData, vendorsData, eventsData] = await Promise.all([
        contractAPI.getUserContracts(userId),
        vendorAPI.getAll(),
        eventAPI.getAll()
      ]);
      setContracts(contractsData);
      setVendors(vendorsData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load contracts and vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.vendorId || !formData.contractText) {
        throw new Error('Vendor and contract text are required');
      }

      // Add user ID to the contract data
      const contractData = {
        ...formData,
        userId: user.id
      };
      
      console.log('Creating contract with data:', contractData); // Debug log
      
      const response = await contractAPI.createContract(contractData);
      
      console.log('Contract creation response:', response); // Debug log

      if (response.success) {
        setSuccess('Contract created successfully! Redirecting to payment...');
        setFormData({ vendorId: '', contractText: '', eventId: '' });
        setShowCreateForm(false);
        
        await loadData(user.id);
        
        setTimeout(() => {
          console.log('Navigating to payment with contractId:', response.contractId); // Debug log
          navigate('/payment', { 
            state: { 
              contractId: response.contractId,
              amount: 100,
              description: `Contract with ${getVendorName(formData.vendorId)}`
            }
          });
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create contract');
      }
    } catch (err) {
      console.error('Contract creation error:', err);
      setError(err.message || 'Sorry, there was an error creating your contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.companyName : 'Unknown Vendor';
  };

  const getEventName = (eventId) => {
    if (!eventId) return 'No Event';
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteContract = async (contractId) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await contractAPI.deleteContract(contractId);
        setSuccess('Contract deleted successfully');
        await loadData(user.id);
      } catch (err) {
        setError('Failed to delete contract');
      }
    }
  };

  const handleSignContract = async (contractId) => {
    try {
      await contractAPI.updateContractStatus(contractId, true);
      setSuccess('Contract signed successfully');
      await loadData(user.id);
    } catch (err) {
      setError('Failed to sign contract');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Contract Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create, manage, and track your vendor contracts with ease. Professional agreements made simple.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{contracts.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                <p className="text-3xl font-bold text-green-600">{contracts.filter(c => c.signed).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{contracts.filter(c => !c.signed).length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-start space-x-3 shadow-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3 shadow-lg">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Create Contract Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3">
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>{showCreateForm ? 'Cancel Creation' : 'Create New Contract'}</span>
            </div>
          </button>
        </div>

        {/* Create Contract Form */}
        {showCreateForm && (
          <div className="mb-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Contract</h2>
                <p className="text-gray-600">Fill in the details to create a professional contract</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Vendor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">Choose a vendor...</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.companyName} - {vendor.serviceType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Associated Event (Optional)
                  </label>
                  <select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">No specific event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} - {event.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Contract Terms & Conditions <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="contractText"
                  value={formData.contractText}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                  placeholder="Describe the contract terms, conditions, pricing, deliverables, timeline, and any special requirements..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Contract...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    <span>Create Contract & Proceed to Payment</span>
                    <Zap className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Contracts List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Your Contracts</h3>
                <p className="text-gray-600 mt-1">Manage and track your vendor agreements</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure & Encrypted</span>
              </div>
            </div>
          </div>

          {contracts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No contracts yet</h3>
              <p className="text-gray-600 mb-8 text-lg">Start building your vendor network by creating your first contract.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your First Contract
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contracts.map((contract, index) => (
                <div key={contract.id} className="p-8 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                            {contract.vendor?.companyName || 'Unknown Vendor'}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              contract.signed 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {contract.signed ? '✓ Signed' : '⏳ Pending'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {contract.vendor?.serviceType || 'Service Provider'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Event</p>
                            <p className="text-gray-900">{getEventName(contract.event?.id)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium">Created</p>
                            <p className="text-gray-900">{formatDate(contract.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Contract Terms</span>
                        </h5>
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{contract.contractText}</p>
                        </div>
                      </div>

                      {contract.signedAt && (
                        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Signed on {formatDate(contract.signedAt)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      {!contract.signed && (
                        <button
                          onClick={() => handleSignContract(contract.id)}
                          className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Sign</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/payment', {
                            state: {
                              contractId: contract.id,
                              amount: 100,
                              description: `Payment for contract with ${contract.vendor?.companyName}`
                            }
                          });
                        }}
                        className="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                      >
                        <CreditCard className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        <span>Pay</span>
                      </button>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
                        className="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;