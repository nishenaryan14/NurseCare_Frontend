"use client";
import DashboardHome from './dashboard-home';
import Link from 'next/link';
import { CheckCircleIcon, UsersIcon, CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  return (
    <div>
      {/* Quick Actions Banner */}
      <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/nurses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Approve Nurses</span>
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
          >
            <UsersIcon className="w-5 h-5" />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>View Bookings</span>
          </Link>
          <Link
            href="/admin/revenue"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            <span>Revenue Analytics</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardHome />
    </div>
  );
}
