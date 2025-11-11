'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Booking } from '@/types'
import Button from '@/components/ui/Button'
import { 
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid'
import { formatDate, formatTime } from '@/lib/utils'
import api from '@/lib/api'

export default function NurseAppointments() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/nurse')
      setBookings(response.data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircleSolid className="w-5 h-5 text-green-500" />
      case 'PENDING_PAYMENT':
        return <ClockSolid className="w-5 h-5 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircleSolid className="w-5 h-5 text-blue-500" />
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockSolid className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status })
      await fetchBookings() // Refresh the list
      setSelectedBooking(null)
    } catch (error) {
      console.error('Failed to update booking status:', error)
    }
  }

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus)

  const statusCounts = {
    all: bookings.length,
    PENDING_PAYMENT: bookings.filter(b => b.status === 'PENDING_PAYMENT').length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.scheduledAt)
    const today = new Date()
    return bookingDate.toDateString() === today.toDateString()
  })

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">
            Manage your patient appointments and provide quality care
          </p>
        </motion.div>

        {/* Today's Appointments Highlight */}
        {todayBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-6 w-6 text-green-500 mr-2" />
                  <h2 className="text-lg font-semibold text-green-900">
                    Today's Appointments ({todayBookings.length})
                  </h2>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Today
                </span>
              </div>
              <div className="space-y-3">
                {todayBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg p-4 border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(booking.status)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.patient?.name || 'Patient'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatTime(booking.scheduledAt)} • {booking.durationMinutes} minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filter by Status</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Appointments', count: statusCounts.all },
                { key: 'PENDING_PAYMENT', label: 'Pending Payment', count: statusCounts.PENDING_PAYMENT },
                { key: 'CONFIRMED', label: 'Confirmed', count: statusCounts.CONFIRMED },
                { key: 'COMPLETED', label: 'Completed', count: statusCounts.COMPLETED },
                { key: 'CANCELLED', label: 'Cancelled', count: statusCounts.CANCELLED },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === filter.key
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(booking.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {booking.patient?.name || 'Patient'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarDaysIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            {formatDate(booking.scheduledAt)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            {formatTime(booking.scheduledAt)} ({booking.durationMinutes} min)
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            Patient Care
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{((booking.nurse?.nurseProfile?.hourlyRate || 0) * booking.durationMinutes / 60).toFixed(0)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.durationMinutes} minutes
                        </p>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {filterStatus === 'all' ? 'No appointments yet' : `No ${filterStatus.toLowerCase().replace('_', ' ')} appointments`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? 'Patients will book appointments with you once your profile is approved'
                  : 'Try selecting a different filter to see more appointments'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Appointment Details Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedBooking(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      <span className="ml-2">{selectedBooking.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* Patient Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{selectedBooking.patient?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{selectedBooking.patient?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date</span>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.scheduledAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Time</span>
                      <p className="mt-1 text-sm text-gray-900">{formatTime(selectedBooking.scheduledAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration</span>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.durationMinutes} minutes</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Earnings</span>
                      <p className="mt-1 text-sm text-gray-900">
                        ₹{(
                          (selectedBooking.nurse?.nurseProfile?.hourlyRate || 0) * 
                          (selectedBooking.durationMinutes / 60)
                        ).toFixed(0)}
                        {!selectedBooking.nurse?.nurseProfile?.hourlyRate && (
                          <span className="text-xs text-yellow-600 ml-2">(Hourly rate not set)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedBooking.status === 'CONFIRMED' && (
                    <div className="flex space-x-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateBookingStatus(selectedBooking.id, 'COMPLETED')}
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                      >
                        Cancel Appointment
                      </Button>
                    </div>
                  )}

                  {/* Booking ID and Dates */}
                  <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
                    <p>Appointment ID: #{selectedBooking.id}</p>
                    <p>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
