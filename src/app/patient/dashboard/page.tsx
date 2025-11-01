'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Booking, NurseProfile } from '@/types'
import Button from '@/components/ui/Button'
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  StarIcon,
  PlusIcon,
  UserGroupIcon,
  HeartIcon,
  ChevronRightIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, ClockIcon as ClockSolidIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import api from '@/lib/api'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import MockPaymentModal from './MockPaymentModal';
import { useRouter } from 'next/navigation';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});
type ReviewForm = z.infer<typeof reviewSchema>;

export default function PatientDashboard() {
  const { user } = useAuth()
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showAllBookings, setShowAllBookings] = useState(false)

  // Review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const {
    register: reviewRegister,
    setValue: setReviewValue,
    handleSubmit: handleReviewSubmit,
    formState: { errors: reviewErrors },
    reset: resetReviewForm,
    watch: watchReview
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  const [payModalBooking, setPayModalBooking] = useState<Booking | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/me')
        setBookings(response.data)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.scheduledAt) > new Date() && booking.status !== 'CANCELLED'
  )

  const completedBookings = bookings.filter(booking => 
    booking.status === 'COMPLETED'
  )

  const stats = [
    {
      name: 'Total Bookings',
      value: bookings.length,
      icon: CalendarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Upcoming',
      value: upcomingBookings.length,
      icon: ClockIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Completed',
      value: completedBookings.length,
      icon: HeartIcon,
      color: 'bg-purple-500',
    },
  ]

  // Make review per booking
  const onReviewBooking = (booking: Booking) => {
    setReviewBooking(booking);
    setIsReviewOpen(true);
  };
  const closeReviewModal = () => {
    setIsReviewOpen(false);
    setReviewBooking(null);
    resetReviewForm();
  };
  const submitReview = async (data: ReviewForm) => {
    if (!reviewBooking) return;
    setReviewLoading(true);
    try {
      await api.post('/reviews', {
        nurseId: reviewBooking.nurse?.nurseProfile?.id,
        rating: data.rating,
        comment: data.comment,
      });
      toast.success('Review submitted!');
      closeReviewModal();
      // Optionally: Refetch completed bookings or reviews or update UI
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  // Helper: Check if a review already exists for this booking (add real check if booking model includes review association, else trust UI for demo)
  const hasReview = (booking: Booking) => {
    // Could be enhanced with a per-booking reviews prop from backend
    return false; // Demo: always allow for now
  };

  function openPayModal(booking: Booking) {
    setPayModalBooking(booking);
    setPayModalOpen(true);
  }
  function closePayModal() {
    setPayModalOpen(false);
    setPayModalBooking(null);
  }
  const handlePaymentSuccess = async () => {
    setLoading(true);
    const response = await api.get('/bookings/me');
    setBookings(response.data);
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? If payment was made, it will be refunded.')) {
      return;
    }

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully. Refund processed if applicable.');
      
      // Refresh bookings
      const response = await api.get('/bookings/me');
      setBookings(response.data);
      setSelectedBooking(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
    }
  };

  // Helper functions for enhanced dashboard
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

  const calculateTotalCost = (hourlyRate: number, durationMinutes: number) => {
    return (hourlyRate * durationMinutes) / 60
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="text-gray-600">
            Manage your nursing appointments and healthcare needs
          </p>
        </motion.div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold">{bookings.length}</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Payment</p>
                <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'PENDING_PAYMENT').length}</p>
              </div>
              <ClockSolidIcon className="h-8 w-8 text-yellow-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'CONFIRMED').length}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'COMPLETED').length}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="justify-start" size="lg" onClick={() => router.push('/nurses')}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Book New Appointment
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                size="lg"
                onClick={() => router.push('/nurses')}
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Find Nurses
              </Button>
              <Button variant="outline" className="justify-start" size="lg">
                <HeartIcon className="h-5 w-5 mr-2" />
                View Health Records
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Pending Payments Section - Highlighted */}
        {bookings.filter(b => b.status === 'PENDING_PAYMENT').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
                  <h2 className="text-lg font-semibold text-red-900">
                    Payment Required ({bookings.filter(b => b.status === 'PENDING_PAYMENT').length})
                  </h2>
                </div>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-red-700 text-sm mb-4">
                Complete your payment to confirm these appointments
              </p>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'PENDING_PAYMENT').map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg p-4 border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <ClockSolidIcon className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {booking.nurse?.name || 'Nurse'}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Payment Pending
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
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{calculateTotalCost(booking.nurse?.nurseProfile?.hourlyRate || 0, booking.durationMinutes)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPayModal(booking)
                          }}
                        >
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirmed Appointments Section */}
        {bookings.filter(b => b.status === 'CONFIRMED').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Confirmed Appointments ({bookings.filter(b => b.status === 'CONFIRMED').length})
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'CONFIRMED').map((booking) => (
                    <motion.div
                      key={booking.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(booking.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {booking.nurse?.name || 'Nurse'}
                              </h3>
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
                              {booking.nurse?.nurseProfile?.location && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                  {booking.nurse.nurseProfile.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ₹{calculateTotalCost(booking.nurse?.nurseProfile?.hourlyRate || 0, booking.durationMinutes)}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{booking.nurse?.nurseProfile?.hourlyRate || 0}/hr
                            </p>
                          </div>
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Completed Appointments Section */}
        {bookings.filter(b => b.status === 'COMPLETED').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-purple-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Completed Appointments ({bookings.filter(b => b.status === 'COMPLETED').length})
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'COMPLETED').slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {booking.nurse?.name || 'Nurse'}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                              Completed
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
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{calculateTotalCost(booking.nurse?.nurseProfile?.hourlyRate || 0, booking.durationMinutes)}
                          </p>
                        </div>
                        {!hasReview(booking) && (
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation()
                            onReviewBooking(booking)
                          }}>
                            Leave Review
                          </Button>
                        )}
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {bookings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-600 mb-6">Get started by booking your first nursing appointment</p>
            <Button size="lg" onClick={() => router.push('/nurses')}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Book Your First Appointment
            </Button>
          </motion.div>
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
                      <span className="text-sm text-gray-900">{selectedBooking.nurse?.name}</span>
                    </div>
                    {selectedBooking.nurse?.nurseProfile?.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{selectedBooking.nurse.nurseProfile.location}</span>
                      </div>
                    )}
                    {selectedBooking.nurse?.nurseProfile?.specialization && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                          Specialization: {selectedBooking.nurse.nurseProfile.specialization.join(', ')}
                        </span>
                      </div>
                    )}
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
                    <p className="mt-1 text-sm text-gray-900">₹{selectedBooking.nurse?.nurseProfile?.hourlyRate}/hr</p>
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
                      <span className="text-gray-900">₹{selectedBooking.nurse?.nurseProfile?.hourlyRate}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 flex justify-between text-sm font-medium">
                      <span className="text-gray-900">Total Cost:</span>
                      <span className="text-gray-900">₹{calculateTotalCost(selectedBooking.nurse?.nurseProfile?.hourlyRate || 0, selectedBooking.durationMinutes)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {selectedBooking.status === 'PENDING_PAYMENT' && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedBooking(null)
                        openPayModal(selectedBooking)
                      }}
                    >
                      Pay Now
                    </Button>
                  )}
                  
                  {(selectedBooking.status === 'PENDING_PAYMENT' || selectedBooking.status === 'CONFIRMED') && (
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  
                  {selectedBooking.status === 'COMPLETED' && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedBooking(null);
                        onReviewBooking(selectedBooking);
                      }}
                    >
                      Leave Review
                    </Button>
                  )}
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

      {/* Review Modal */}
      <Dialog open={isReviewOpen} onClose={closeReviewModal} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <form
            className="relative bg-white rounded-lg shadow-lg max-w-sm mx-auto w-full p-6 z-10"
            onSubmit={handleReviewSubmit(submitReview)}
          >
            <Dialog.Title className="text-lg font-bold mb-2">Leave a Review</Dialog.Title>
            <div className="mb-4 flex items-center">
              {[1,2,3,4,5].map((i) => (
                <span
                  key={i}
                  onClick={() => setReviewValue('rating', i)}
                  className={`cursor-pointer ${watchReview('rating') >= i ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
              {reviewErrors.rating && <span className="text-xs text-red-600 ml-2">{reviewErrors.rating.message}</span>}
            </div>
            <textarea
              className="block w-full p-2 border border-gray-300 rounded mb-4"
              rows={3}
              placeholder="Say something about your experience ..."
              {...reviewRegister('comment')}
            />
            <Button type="submit" loading={reviewLoading} disabled={reviewLoading} className="w-full">
              Submit Review
            </Button>
            <Button type="button" variant="ghost" className="w-full mt-2" onClick={closeReviewModal}>
              Cancel
            </Button>
          </form>
        </div>
      </Dialog>
      <MockPaymentModal
        open={payModalOpen}
        onClose={closePayModal}
        booking={payModalBooking}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}


