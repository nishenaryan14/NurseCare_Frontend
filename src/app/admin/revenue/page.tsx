'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  topNurses: Array<{
    name: string;
    revenue: number;
    bookings: number;
  }>;
}

export default function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/revenue');
      setRevenueData(response.data);
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-500 mt-1">Track financial performance and revenue metrics</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">₹{(revenueData?.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-green-100 text-sm mt-2">All time earnings</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CurrencyDollarIcon className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Monthly Revenue</p>
              <p className="text-4xl font-bold">₹{(revenueData?.monthlyRevenue || 0).toLocaleString()}</p>
              <p className="text-blue-100 text-sm mt-2">This month</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CalendarIcon className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Growth Rate</p>
              <p className="text-4xl font-bold">
                {revenueData?.totalRevenue && revenueData?.monthlyRevenue
                  ? ((revenueData.monthlyRevenue / revenueData.totalRevenue) * 100).toFixed(1)
                  : '0'}%
              </p>
              <p className="text-purple-100 text-sm mt-2">Monthly contribution</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Nurses */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Top Performing Nurses</h2>
        </div>

        {revenueData?.topNurses && revenueData.topNurses.length > 0 ? (
          <div className="space-y-4">
            {revenueData.topNurses.map((nurse, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{nurse.name}</p>
                    <p className="text-sm text-gray-500">{nurse.bookings} completed bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹{nurse.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No revenue data available yet</p>
          </div>
        )}
      </div>

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Completed Bookings</span>
              <span className="font-semibold text-blue-600">₹{(revenueData?.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">This Month</span>
              <span className="font-semibold text-green-600">₹{(revenueData?.monthlyRevenue || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Average per Booking</span>
              <span className="font-semibold text-purple-600">
                ₹{revenueData?.topNurses && revenueData.topNurses.length > 0
                  ? Math.round(revenueData.topNurses.reduce((sum, n) => sum + n.revenue, 0) / 
                    revenueData.topNurses.reduce((sum, n) => sum + n.bookings, 0))
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Total Nurses</span>
              <span className="font-semibold text-yellow-600">{revenueData?.topNurses?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
