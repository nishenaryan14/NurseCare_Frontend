'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Nurses', href: '/admin/nurses', icon: UserGroupIcon },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon },
  { name: 'Revenue', href: '/admin/revenue', icon: CurrencyDollarIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-blue-500">
            <div>
              <h1 className="text-2xl font-bold">NurseCare</h1>
              <p className="text-xs text-blue-200">Admin Dashboard</p>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500">
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-700 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-bold">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-blue-200">admin@nursecare.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
