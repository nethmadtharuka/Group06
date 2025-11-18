import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { SearchIcon, CheckIcon, XIcon, StarIcon, EyeIcon } from 'lucide-react';
import { vendorAPI, adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const vendorsData = await vendorAPI.getAllVendors();
      setVendors(vendorsData || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: string) => {
    try {
      await adminAPI.approveVendor(vendorId);
      loadVendors();
      alert('Vendor approved successfully!');
    } catch (error: any) {
      console.error('Error approving vendor:', error);
      alert(error.message || 'Failed to approve vendor. Please try again.');
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!confirm('Are you sure you want to reject this vendor?')) {
      return;
    }
    try {
      await adminAPI.rejectVendor(vendorId);
      loadVendors();
      alert('Vendor rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting vendor:', error);
      alert(error.message || 'Failed to reject vendor. Please try again.');
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-600';
      case 'PENDING':
        return 'bg-yellow-600';
      case 'REJECTED':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredVendors = vendors.filter((vendor: any) => {
    const matchesSearch = 
      vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || vendor.approvalStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    approved: vendors.filter((v: any) => v.approvalStatus === 'APPROVED').length,
    pending: vendors.filter((v: any) => v.approvalStatus === 'PENDING').length,
    rejected: vendors.filter((v: any) => v.approvalStatus === 'REJECTED').length,
  };

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Vendors Management</h1>
          </div>
        </header>
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Total Vendors</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'ALL' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'APPROVED' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'PENDING' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('REJECTED')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'REJECTED' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading vendors...</div>
          ) : (
            <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Vendor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Service Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                        {searchTerm || filterStatus !== 'ALL' 
                          ? 'No vendors found matching your filters' 
                          : 'No vendors found'}
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor: any) => (
                      <tr key={vendor.id} className="border-b border-gray-700 hover:bg-gray-900 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {vendor.mainPhotoURL ? (
                              <img 
                                src={vendor.mainPhotoURL} 
                                alt={vendor.companyName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                                {vendor.companyName?.[0] || 'V'}
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{vendor.companyName || 'N/A'}</p>
                              <p className="text-gray-400 text-sm">{vendor.user?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{vendor.serviceType || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <StarIcon size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-white">{vendor.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusBadgeColor(vendor.approvalStatus || 'PENDING')}`}>
                            {vendor.approvalStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(vendor.createdAt)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/vendor/${vendor.id}`)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              <EyeIcon size={18} />
                            </button>
                            {vendor.approvalStatus === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(vendor.id)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Approve Vendor"
                                >
                                  <CheckIcon size={18} />
                                </button>
                                <button
                                  onClick={() => handleReject(vendor.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="Reject Vendor"
                                >
                                  <XIcon size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
