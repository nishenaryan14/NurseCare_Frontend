'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  MapPinIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, ClockIcon as ClockSolidIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Booking {
  id: number
  patientId: number
  nurseId: number
  scheduledAt: string
  durationMinutes: number
  status: string
  createdAt: string
  updatedAt: string
  nurse: {
    id: number
    name: string
    email: string
    nurseProfile: {
      id: number
      specialization: string[]
      hourlyRate: number
      location: string
      availability: Record<string, number[]>
    }
  }
}

const PatientDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/bookings/me')
      setBookings(response.data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'PENDING_PAYMENT':
        return <ClockSolidIcon className="w-5 h-5 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockSolidIcon className="w-5 h-5 text-gray-500" />
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const calculateTotalCost = (hourlyRate: number, durationMinutes: number) => {
    return (hourlyRate * durationMinutes) / 60
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and track your nursing appointments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockSolidIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'PENDING_PAYMENT').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by booking your first appointment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(booking.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {booking.nurse.name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDaysIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {formatDate(booking.scheduledAt)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {formatTime(booking.scheduledAt)} ({booking.durationMinutes} min)
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {booking.nurse.nurseProfile.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{calculateTotalCost(booking.nurse.nurseProfile.hourlyRate, booking.durationMinutes)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{booking.nurse.nurseProfile.hourlyRate}/hr
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
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
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
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

                {/* Nurse Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Nurse Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedBooking.nurse.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedBooking.nurse.nurseProfile.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        Specialization: {selectedBooking.nurse.nurseProfile.specialization.join(', ')}
                      </span>
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
                    <span className="text-sm font-medium text-gray-500">Hourly Rate</span>
                    <p className="mt-1 text-sm text-gray-900">₹{selectedBooking.nurse.nurseProfile.hourlyRate}/hr</p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Duration:</span>
                      <span className="text-gray-900">{selectedBooking.durationMinutes} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="text-gray-900">₹{selectedBooking.nurse.nurseProfile.hourlyRate}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 flex justify-between text-sm font-medium">
                      <span className="text-gray-900">Total Cost:</span>
                      <span className="text-gray-900">₹{calculateTotalCost(selectedBooking.nurse.nurseProfile.hourlyRate, selectedBooking.durationMinutes)}</span>
                    </div>
                  </div>
                </div>

                {/* Booking ID and Dates */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Booking ID: #{selectedBooking.id}</p>
                  <p>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  <p>Last Updated: {new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientDashboard
