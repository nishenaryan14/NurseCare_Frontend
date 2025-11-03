'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useSocket } from '@/contexts/SocketContext'
import api from '@/lib/api'
const Header = () => {
  const { user, logout } = useAuth()
  const { socket } = useSocket()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread count
  useEffect(() => {
    if (!user) return

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/messaging/unread-count')
        setUnreadCount(response.data.count)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()

    // Listen for new messages to update count
    if (socket) {
      socket.on('newMessage', () => {
        fetchUnreadCount()
      })
    }

    return () => {
      if (socket) {
        socket.off('newMessage')
      }
    }
  }, [user, socket])

  const getNavigation = () => {
    // Navigation for Admin
    if (user && user.role === 'ADMIN') {
      return [
        { name: 'Home', href: '/' },
        { name: 'Admin Dashboard', href: '/admin' },
        { name: 'All Nurses', href: '/nurses' },
        { name: 'Support', href: '/support' },
      ]
    }
    
    // Navigation for Patients
    if (user && user.role === 'PATIENT') {
      return [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/patient/dashboard' },
        { name: 'Find Nurses', href: '/nurses' },
        { name: 'My Bookings', href: '/patient/bookings' },
        { name: 'Messages', href: '/messages' },
        { name: 'Support', href: '/support' },
      ]
    }
    
    // Navigation for Nurses
    if (user && user.role === 'NURSE') {
      return [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/nurse/dashboard' },
        { name: 'My Appointments', href: '/nurse/appointments' },
        { name: 'Availability', href: '/nurse/availability' },
        { name: 'Messages', href: '/messages' },
        { name: 'Earnings', href: '/nurse/earnings' },
        { name: 'Support', href: '/support' },
      ]
    }
    
    // Default navigation for non-authenticated users
    return [
      { name: 'Home', href: '/' },
      { name: 'Find Nurses', href: '/nurses' },
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'For Nurses', href: '/for-nurses' },
      { name: 'About', href: '/about' },
    ]
  }

  const navigation = getNavigation()

  // Remove the automatic redirect logic from Header
  // The AuthContext and main page handle redirections properly

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600"
              >
                <span className="text-white font-bold text-lg">N</span>
              </motion.div>
              <span className="text-xl font-bold text-gray-900">NurseCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative"
              >
                {item.name}
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={
                    user.role === 'ADMIN' ? '/admin' :
                    user.role === 'NURSE' ? '/nurse/dashboard' : 
                    '/patient/dashboard'
                  }
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user.name || user.email}</span>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-4">
                    <Link
                      href={
                        user.role === 'ADMIN' ? '/admin' :
                        user.role === 'NURSE' ? '/nurse/dashboard' : 
                        '/patient/dashboard'
                      }
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-6 w-6" />
                      <span>{user.name || user.email}</span>
                    </Link>
                    <Button variant="outline" onClick={logout} className="w-full">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Login</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Header


