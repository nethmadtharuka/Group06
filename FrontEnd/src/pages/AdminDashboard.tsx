import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { StatsCard } from '../components/StatsCard';
import { SearchIcon, BellIcon, UserCircleIcon, PlusCircleIcon, Users2Icon, BarChart3Icon, SlidersIcon, MoreVerticalIcon } from 'lucide-react';
import { adminAPI } from '../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }

        const [statsData, vendorsData] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getPendingVendors()
        ]);

        setStats(statsData);
        setPendingVendors(vendorsData || []);
      } catch (error) {
        console.error('Error loading admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = async (vendorId: string) => {
    try {
      await adminAPI.approveVendor(vendorId);
      // Reload pending vendors
      const vendorsData = await adminAPI.getPendingVendors();
      setPendingVendors(vendorsData || []);
    } catch (error: any) {
      alert(error.message || 'Failed to approve vendor');
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!confirm('Are you sure you want to reject this vendor?')) {
      return;
    }
    try {
      await adminAPI.rejectVendor(vendorId);
      // Reload pending vendors
      const vendorsData = await adminAPI.getPendingVendors();
      setPendingVendors(vendorsData || []);
    } catch (error: any) {
      alert(error.message || 'Failed to reject vendor');
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

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  return <div className="flex min-h-screen bg-[#0a0a0f] w-full">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64">
        <header className="bg-[#0a0a0f] border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search for events, users, vendors..." className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <button className="relative p-2 rounded-full hover:bg-gray-800">
                <BellIcon size={20} className="text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-[#e8c4a3] flex items-center justify-center">
                <UserCircleIcon size={24} className="text-white" />
              </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.fullName || user?.username || 'Admin'}! Here's what's happening with EventCraft today.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading dashboard data...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard 
                  title="Total Active Users" 
                  value={stats?.totalUsers?.toLocaleString() || '0'} 
                  change={`${stats?.usersChange || '0%'} from last month`} 
                  isPositive={true} 
                />
                <StatsCard 
                  title="Total Events" 
                  value={stats?.totalEvents?.toLocaleString() || '0'} 
                  change={`${stats?.eventsChange || '0%'} from last month`} 
                  isPositive={true} 
                />
                <StatsCard 
                  title="Bookings (30d)" 
                  value={stats?.bookings30d?.toLocaleString() || '0'} 
                  change={`${stats?.bookingsChange || '0%'} from last month`} 
                  isPositive={stats?.bookingsChange?.startsWith('+') || false} 
                />
                <StatsCard 
                  title="Revenue (30d)" 
                  value={formatCurrency(stats?.revenue30d)} 
                  change={`${stats?.revenueChange || '0%'} from last month`} 
                  isPositive={true} 
                />
              </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Pending Vendor Approvals
              </h2>
              <button className="text-purple-500 hover:text-purple-400 text-sm font-medium">
                View All Requests
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Vendor Name
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Date Submitted
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVendors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 px-4 text-center text-gray-400">
                        No pending vendor approvals
                      </td>
                    </tr>
                  ) : (
                    pendingVendors.map((vendor: any) => (
                      <tr key={vendor.id} className="border-b border-gray-700">
                        <td className="py-4 px-4 text-white">{vendor.companyName || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-300">
                          {vendor.serviceType || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {formatDate(vendor.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => handleApprove(vendor.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2 text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(vendor.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <PlusCircleIcon size={32} className="text-blue-500 mx-auto mb-3" />
                <p className="text-white font-medium">Create Event</p>
              </button>
              <button className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <Users2Icon size={32} className="text-blue-500 mx-auto mb-3" />
                <p className="text-white font-medium">Manage Users</p>
              </button>
              <button className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <BarChart3Icon size={32} className="text-blue-500 mx-auto mb-3" />
                <p className="text-white font-medium">View Reports</p>
              </button>
              <button className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <SlidersIcon size={32} className="text-blue-500 mx-auto mb-3" />
                <p className="text-white font-medium">Site Settings</p>
              </button>
            </div>
          </div>
            </>
          )}
        </main>
      </div>
    </div>;
};