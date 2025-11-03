'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';
import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalNurses: number;
    totalPatients: number;
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRevenue: number;
    activeConversations: number;
    totalMessages: number;
    totalFiles: number;
  };
  growth: {
    newUsersLast30Days: number;
    newBookingsLast30Days: number;
    userGrowthRate: string;
    bookingGrowthRate: string;
  };
  recentActivity: {
    recentBookings: any[];
    recentUsers: any[];
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const bookingStatusData = [
    { name: 'Pending', value: stats.overview.pendingBookings },
    { name: 'Completed', value: stats.overview.completedBookings },
    { name: 'In Progress', value: stats.overview.totalBookings - stats.overview.pendingBookings - stats.overview.completedBookings },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.overview.totalUsers.toLocaleString()}
          icon={<UsersIcon className="w-8 h-8" />}
          trend={{ value: parseFloat(stats.growth.userGrowthRate), isPositive: parseFloat(stats.growth.userGrowthRate) > 0 }}
          color="blue"
        />
        <StatsCard
          title="Total Bookings"
          value={stats.overview.totalBookings.toLocaleString()}
          icon={<CalendarIcon className="w-8 h-8" />}
          trend={{ value: parseFloat(stats.growth.bookingGrowthRate), isPositive: parseFloat(stats.growth.bookingGrowthRate) > 0 }}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(stats.overview.totalRevenue / 1000).toFixed(1)}K`}
          icon={<CurrencyDollarIcon className="w-8 h-8" />}
          color="yellow"
        />
        <StatsCard
          title="Active Chats"
          value={stats.overview.activeConversations.toLocaleString()}
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8" />}
          color="purple"
        />
        <StatsCard
          title="Nurses"
          value={stats.overview.totalNurses.toLocaleString()}
          icon={<UsersIcon className="w-8 h-8" />}
          color="indigo"
        />
        <StatsCard
          title="Patients"
          value={stats.overview.totalPatients.toLocaleString()}
          icon={<UsersIcon className="w-8 h-8" />}
          color="blue"
        />
        <StatsCard
          title="Pending Bookings"
          value={stats.overview.pendingBookings.toLocaleString()}
          icon={<ClockIcon className="w-8 h-8" />}
          color="yellow"
        />
        <StatsCard
          title="Completed"
          value={stats.overview.completedBookings.toLocaleString()}
          icon={<CheckCircleIcon className="w-8 h-8" />}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Nurses', value: stats.overview.totalNurses },
                  { name: 'Patients', value: stats.overview.totalPatients },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {stats.recentActivity.recentBookings.length > 0 ? (
              stats.recentActivity.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.patient.name}</p>
                    <p className="text-sm text-gray-500">with {booking.nurse.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats.recentActivity.recentUsers.length > 0 ? (
              stats.recentActivity.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'NURSE' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'PATIENT' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>

      {/* Growth Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Growth Metrics (Last 30 Days)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-blue-100 text-sm">New Users</p>
            <p className="text-3xl font-bold">{stats.growth.newUsersLast30Days}</p>
            <p className="text-blue-100 text-sm mt-1">+{stats.growth.userGrowthRate}% growth</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">New Bookings</p>
            <p className="text-3xl font-bold">{stats.growth.newBookingsLast30Days}</p>
            <p className="text-blue-100 text-sm mt-1">+{stats.growth.bookingGrowthRate}% growth</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Messages</p>
            <p className="text-3xl font-bold">{stats.overview.totalMessages.toLocaleString()}</p>
            <p className="text-blue-100 text-sm mt-1">Across all chats</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Files Shared</p>
            <p className="text-3xl font-bold">{stats.overview.totalFiles.toLocaleString()}</p>
            <p className="text-blue-100 text-sm mt-1">Total uploads</p>
          </div>
        </div>
      </div>
    </div>
  );
}
