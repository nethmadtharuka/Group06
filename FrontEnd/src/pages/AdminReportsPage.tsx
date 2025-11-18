import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { adminAPI } from '../services/api';
import { TrendingUpIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

export const AdminReportsPage = () => {
  const [growthReport, setGrowthReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const reportData = await adminAPI.getGrowthReport();
        setGrowthReport(reportData);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'Rs. 0';
    return 'Rs. ' + new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          </div>
        </header>
        <main className="p-8">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading reports...</div>
          ) : growthReport ? (
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
          ) : (
            <div className="text-center py-12 text-gray-400">No report data available</div>
          )}
        </main>
      </div>
    </div>
  );
};

