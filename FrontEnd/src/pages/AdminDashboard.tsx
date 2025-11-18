import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { StatsCard } from '../components/StatsCard';
import { SearchIcon, BellIcon, UserCircleIcon, PlusCircleIcon, Users2Icon, BarChart3Icon, SlidersIcon, MoreVerticalIcon, MessageSquareIcon, StarIcon, TrendingUpIcon, TrendingDownIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [supportChats, setSupportChats] = useState<any[]>([]);
  const [bestVendors, setBestVendors] = useState<any[]>([]);
  const [growthReport, setGrowthReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'reports'>('overview');
  const navigate = useNavigate();
  const location = useLocation();

  // Sync active tab with URL
  useEffect(() => {
    if (location.pathname === '/admin') {
      setActiveTab('overview');
    } else if (location.pathname.includes('/admin/messages')) {
      setActiveTab('messages');
    } else if (location.pathname.includes('/admin/reports')) {
      setActiveTab('reports');
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }

        const [statsData, vendorsData, chatsData, bestVendorsData, reportData] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getPendingVendors(),
          adminAPI.getSupportChats(),
          adminAPI.getBestVendors(),
          adminAPI.getGrowthReport()
        ]);

        setStats(statsData);
        setPendingVendors(vendorsData || []);
        setSupportChats(chatsData || []);
        setBestVendors(bestVendorsData || []);
        setGrowthReport(reportData);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading admin dashboard data:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = async (vendorId: string) => {
    try {
      await adminAPI.approveVendor(vendorId);
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
      const vendorsData = await adminAPI.getPendingVendors();
      setPendingVendors(vendorsData || []);
    } catch (error: any) {
      alert(error.message || 'Failed to reject vendor');
    }
  };

  const handleOpenChat = async (chat: any) => {
    try {
      navigate('/admin/messages/view', { state: { chatId: chat.id } });
    } catch (error) {
      console.error('Error opening chat:', error);
      navigate('/admin/messages/view', { state: { chatId: chat.id } });
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'Rs. 0';
    return 'Rs. ' + new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChatDisplayName = (chat: any) => {
    if (chat.user) {
      return chat.user.fullName || chat.user.username || 'User';
    }
    if (chat.vendor && chat.vendor.companyName !== 'Event Craft Support') {
      return chat.vendor.companyName || 'Vendor';
    }
    if (chat.vendor2 && chat.vendor2.companyName !== 'Event Craft Support') {
      return chat.vendor2.companyName || 'Vendor';
    }
    return 'Unknown';
  };

  return <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
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

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'messages'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Support Messages
              {supportChats.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {supportChats.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reports & Analytics
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading dashboard data...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
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

                  {/* Best Vendors Quick Actions */}
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <StarIcon className="mr-2 text-yellow-400" size={24} />
                        Top Performing Vendors
                      </h2>
                      <button className="text-purple-500 hover:text-purple-400 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bestVendors.slice(0, 6).map((vendor: any, index: number) => (
                        <div key={vendor.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-purple-400 font-bold text-lg">#{index + 1}</span>
                              <h3 className="text-white font-medium">{vendor.companyName}</h3>
                            </div>
                            <div className="flex items-center text-yellow-400">
                              <StarIcon size={16} className="fill-current" />
                              <span className="ml-1 text-sm">{vendor.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{vendor.serviceType}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{vendor.totalBookings || 0} bookings</span>
                            <span className="text-green-400 font-medium">{formatCurrency(vendor.totalRevenue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Vendor Name</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Date Submitted</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
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
                                <td className="py-4 px-4 text-gray-300">{vendor.serviceType || 'N/A'}</td>
                                <td className="py-4 px-4 text-gray-300">{formatDate(vendor.createdAt)}</td>
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
                      <button 
                        onClick={() => navigate('/event/create')}
                        className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                      >
                        <PlusCircleIcon size={32} className="text-blue-500 mx-auto mb-3" />
                        <p className="text-white font-medium">Create Event</p>
                      </button>
                      <button 
                        onClick={() => navigate('/admin/users')}
                        className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                      >
                        <Users2Icon size={32} className="text-blue-500 mx-auto mb-3" />
                        <p className="text-white font-medium">Manage Users</p>
                      </button>
                      <button 
                        onClick={() => navigate('/admin/reports')} 
                        className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                      >
                        <BarChart3Icon size={32} className="text-blue-500 mx-auto mb-3" />
                        <p className="text-white font-medium">View Reports</p>
                      </button>
                      <button 
                        onClick={() => navigate('/admin/settings')}
                        className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                      >
                        <SlidersIcon size={32} className="text-blue-500 mx-auto mb-3" />
                        <p className="text-white font-medium">Site Settings</p>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'messages' && (
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <MessageSquareIcon className="mr-2" size={24} />
                    Support Messages
                  </h2>
                  {supportChats.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <MessageSquareIcon size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No support messages at this time</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportChats.map((chat: any) => (
                        <div
                          key={chat.id}
                          className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                          onClick={() => handleOpenChat(chat)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-1">{getChatDisplayName(chat)}</h3>
                              <p className="text-gray-400 text-sm truncate">{chat.lastMessage || 'No messages yet'}</p>
                            </div>
                            <div className="ml-4 text-right">
                              <p className="text-gray-500 text-xs mb-1">{formatDate(chat.lastMessageAt || chat.createdAt)}</p>
                              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                                Open Chat →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reports' && growthReport && (
                <div className="space-y-6">
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                      <TrendingUpIcon className="mr-2" size={24} />
                      Growth Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">User Growth</span>
                          {growthReport.userGrowthRate >= 0 ? (
                            <ArrowUpIcon className="text-green-400" size={20} />
                          ) : (
                            <ArrowDownIcon className="text-red-400" size={20} />
                          )}
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{growthReport.userGrowthRate?.toFixed(1) || '0'}%</p>
                        <p className="text-gray-500 text-xs">{growthReport.usersLast30Days || 0} new users (30d)</p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Vendor Growth</span>
                          {growthReport.vendorGrowthRate >= 0 ? (
                            <ArrowUpIcon className="text-green-400" size={20} />
                          ) : (
                            <ArrowDownIcon className="text-red-400" size={20} />
                          )}
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{growthReport.vendorGrowthRate?.toFixed(1) || '0'}%</p>
                        <p className="text-gray-500 text-xs">{growthReport.vendorsLast30Days || 0} new vendors (30d)</p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Event Growth</span>
                          {growthReport.eventGrowthRate >= 0 ? (
                            <ArrowUpIcon className="text-green-400" size={20} />
                          ) : (
                            <ArrowDownIcon className="text-red-400" size={20} />
                          )}
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{growthReport.eventGrowthRate?.toFixed(1) || '0'}%</p>
                        <p className="text-gray-500 text-xs">{growthReport.eventsLast30Days || 0} new events (30d)</p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Booking Growth</span>
                          {growthReport.bookingGrowthRate >= 0 ? (
                            <ArrowUpIcon className="text-green-400" size={20} />
                          ) : (
                            <ArrowDownIcon className="text-red-400" size={20} />
                          )}
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{growthReport.bookingGrowthRate?.toFixed(1) || '0'}%</p>
                        <p className="text-gray-500 text-xs">{growthReport.bookingsLast30Days || 0} bookings (30d)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6">Monthly Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((monthNum) => {
                        const monthData = growthReport.monthlyBreakdown?.[`month${monthNum}`];
                        return (
                          <div key={monthNum} className="bg-gray-900 rounded-lg p-4">
                            <h3 className="text-white font-medium mb-4">Month {monthNum}</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Users</span>
                                <span className="text-white font-medium">{monthData?.users || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Bookings</span>
                                <span className="text-white font-medium">{monthData?.bookings || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Revenue</span>
                                <span className="text-green-400 font-medium">{formatCurrency(monthData?.revenue || 0)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>;
};
