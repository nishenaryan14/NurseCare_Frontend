'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Booking } from '@/types'
import Button from '@/components/ui/Button'
import { 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { formatDate, formatTime } from '@/lib/utils'
import api from '@/lib/api'

interface EarningsData {
  totalEarnings: number
  thisMonthEarnings: number
  completedAppointments: number
  averageHourlyEarning: number
  recentPayments: any[]
}

export default function NurseEarnings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<string>('all')
  const [nurseProfile, setNurseProfile] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsResponse, profileResponse] = await Promise.all([
        api.get('/bookings/nurse'),
        api.get('/nurses/me')
      ])
      setBookings(bookingsResponse.data)
      setNurseProfile(profileResponse.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedBookings = bookings.filter(booking => booking.status === 'COMPLETED')
  
  const calculateEarnings = (bookingsList: Booking[]) => {
    return bookingsList.reduce((total, booking) => {
      if (booking.status === 'COMPLETED') {
        return total + ((nurseProfile?.hourlyRate || 0) * booking.durationMinutes / 60)
      }
      return total
    }, 0)
  }

  const getFilteredBookings = () => {
    const now = new Date()
    switch (timeFilter) {
      case 'today':
        return completedBookings.filter(booking => {
          const bookingDate = new Date(booking.scheduledAt)
          return bookingDate.toDateString() === now.toDateString()
        })
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return completedBookings.filter(booking => 
          new Date(booking.scheduledAt) >= weekAgo
        )
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return completedBookings.filter(booking => 
          new Date(booking.scheduledAt) >= monthAgo
        )
      default:
        return completedBookings
    }
  }

  const filteredBookings = getFilteredBookings()
  const totalEarnings = calculateEarnings(filteredBookings)
  const totalHours = filteredBookings.reduce((total, booking) => total + booking.durationMinutes, 0) / 60
  const averageHourlyEarning = totalHours > 0 ? totalEarnings / totalHours : 0

  const earningsData: EarningsData = {
    totalEarnings,
    thisMonthEarnings: calculateEarnings(completedBookings.filter(booking => {
      const bookingDate = new Date(booking.scheduledAt)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()
    })),
    completedAppointments: filteredBookings.length,
    averageHourlyEarning,
    recentPayments: filteredBookings.slice(0, 10)
  }

  const timeFilters = [
    { key: 'all', label: 'All Time' },
    { key: 'month', label: 'Last 30 Days' },
    { key: 'week', label: 'Last 7 Days' },
    { key: 'today', label: 'Today' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Earnings</h1>
              <p className="text-gray-600">
                Track your income and payment history
              </p>
            </div>
            <Button variant="outline" className="flex items-center">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Time Period</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setTimeFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeFilter === filter.key
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Earnings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold">₹{earningsData.totalEarnings.toFixed(0)}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{earningsData.completedAppointments}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg. Hourly</p>
                <p className="text-3xl font-bold">₹{earningsData.averageHourlyEarning.toFixed(0)}</p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Hours</p>
                <p className="text-3xl font-bold">{totalHours.toFixed(1)}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-200" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Payments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                <Button variant="outline" size="sm" className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : earningsData.recentPayments.length > 0 ? (
                <div className="space-y-4">
                  {earningsData.recentPayments.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <BanknotesIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.patient?.name || 'Patient'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(booking.scheduledAt)} • {booking.durationMinutes} minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{((nurseProfile?.hourlyRate || 0) * booking.durationMinutes / 60).toFixed(0)}
                        </p>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                  <p className="text-gray-600">
                    Complete appointments to start earning
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Earnings Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Earnings Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Hourly Rate</span>
                  <span className="font-semibold text-green-600">₹{nurseProfile?.hourlyRate || 0}/hr</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Hours Worked</span>
                  <span className="font-semibold text-blue-600">{totalHours.toFixed(1)} hrs</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Appointments</span>
                  <span className="font-semibold text-purple-600">{earningsData.completedAppointments}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Earned</span>
                    <span className="text-2xl font-bold text-green-600">₹{earningsData.totalEarnings.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">Payment Info</h3>
                <p className="text-xs text-yellow-700">
                  Payments are processed weekly and deposited directly to your registered bank account.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips to Increase Earnings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Maintain High Ratings</h4>
                  <p className="text-sm text-blue-800">Provide excellent care to get more bookings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CalendarDaysIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Set More Available Hours</h4>
                  <p className="text-sm text-blue-800">More availability means more opportunities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Be Punctual</h4>
                  <p className="text-sm text-blue-800">Reliability leads to repeat customers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BanknotesIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Complete Profiles</h4>
                  <p className="text-sm text-blue-800">Detailed profiles attract more patients</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
