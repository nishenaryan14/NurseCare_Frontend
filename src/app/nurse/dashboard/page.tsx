'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Booking, NurseProfile, Review } from '@/types'
import Button from '@/components/ui/Button'
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  StarIcon,
  UserIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import api from '@/lib/api'
import Input from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import AvailabilityModal from './AvailabilityModal';

const nurseProfileSchema = z.object({
  specialization: z.string().min(2, 'Specialization is required'),
  hourlyRate: z.number().min(1, 'Hourly rate must be positive'),
  location: z.string().min(2, 'Location is required'),
});

type NurseProfileForm = z.infer<typeof nurseProfileSchema>;

// Utility constants
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 to 20 (8am-8pm)

function pad(n: number) { return n < 10 ? `0${n}` : n; }
function fmtHour(h: number) { return `${(h % 12 || 12)}${h < 12 ? 'am' : 'pm'}`; }

export default function NurseDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [nurseProfile, setNurseProfile] = useState<NurseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAllBookings, setShowAllBookings] = useState(false);
  // Form for creating nurse profile
  const {
    register: npRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: npErrors },
    reset: npReset,
    setValue,
    watch
  } = useForm<NurseProfileForm>({
    resolver: zodResolver(nurseProfileSchema),
    defaultValues: { specialization: '', hourlyRate: 500, location: '' },
  });
  const [profileFormLoading, setProfileFormLoading] = useState(false);
  const [availability, setAvailability] = useState<any>({});
  const [availLoading, setAvailLoading] = useState(false);
  const [availSaving, setAvailSaving] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const todayIdx = new Date().getDay() - 1 < 0 ? 6 : new Date().getDay() - 1; // Monday: 0, Sunday: 6
  const currentHour = new Date().getHours();
  const [justSaved, setJustSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [bookingsResponse, profileResponse] = await Promise.all([
        api.get('/bookings/nurse'),
        api.get('/nurses/me'),
      ]);
      setBookings(bookingsResponse.data);
      setNurseProfile(profileResponse.data);
      console.log('Refreshed - Total Earnings:', profileResponse.data?.totalEarnings);
      toast.success('Dashboard refreshed!');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResponse, profileResponse] = await Promise.all([
          api.get('/bookings/nurse'),
          api.get('/nurses/me'),
        ]);
        setBookings(bookingsResponse.data);
        setNurseProfile(profileResponse.data);
        console.log('Nurse Profile Data:', profileResponse.data); // Debug log
        console.log('Total Earnings from API:', profileResponse.data?.totalEarnings); // Debug log
        setProfileError(false);
        // Fetch recent reviews only if nurse profile exists (and is this nurse)
        if (profileResponse.data?.id) {
          const reviewsRes = await api.get(`/reviews/nurse/${profileResponse.data.id}`);
          setRecentReviews(reviewsRes.data.slice(0, 3));
        } else {
          setRecentReviews([]);
        }
      } catch (error: any) {
        if (error?.response && error.response.status === 404) {
          setNurseProfile(null);
          setProfileError(true);
          setRecentReviews([]);
        } else {
          console.error('Failed to fetch data:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch availability when nurseProfile loads
  useEffect(() => {
    if (nurseProfile?.id) {
      setAvailLoading(true);
      api.get(`/nurses/availability/${nurseProfile.id}`)
        .then(res => setAvailability(res.data.availability || {}))
        .catch(() => setAvailability({}))
        .finally(() => setAvailLoading(false));
    }
  }, [nurseProfile]);

  // Handler to toggle available slot
  function toggleSlot(day: string, hour: number) {
    setAvailability((prev: any) => {
      const copy = { ...prev };
      if (!copy[day]) copy[day] = [];
      if (copy[day].includes(hour)) {
        copy[day] = copy[day].filter((h: number) => h !== hour);
      } else {
        copy[day] = [...copy[day], hour];
      }
      return copy;
    });
  }

  async function saveAvailability() {
    setAvailSaving(true);
    try {
      await api.patch('/nurses/availability', { availability });
      toast.success('Availability updated!');
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch (e) {
      toast.error('Failed to save availability');
    }
    setAvailSaving(false);
  }

  // helper actions
  function clearAll() {
    setAvailability(daysOfWeek.reduce((acc, d) => { acc[d] = []; return acc; }, {}));
  }
  function selectAllWeekdays() {
    setAvailability(
      daysOfWeek.reduce((acc, d, i) => {
        acc[d] = i < 5 ? [...hours] : [];
        return acc;
      }, {} as any)
    );
  }

  async function handleSaveAvailability(newAvail:any) {
    await api.patch('/nurses/availability', { availability: newAvail });
    toast.success('Availability updated!');
    setAvailability(newAvail);
  }

  const onProfileFormSubmit = async (data: NurseProfileForm) => {
    setProfileFormLoading(true);
    try {
      // Allow comma or semicolon separated for multi-specialization
      const specializations = data.specialization.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
      await api.post('/nurses', {
        specialization: specializations,
        hourlyRate: data.hourlyRate,
        location: data.location,
      });
      // Fetch new profile
      const res = await api.get('/nurses/me');
      setNurseProfile(res.data);
      setProfileError(false);
      npReset();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Profile could not be created.');
    } finally {
      setProfileFormLoading(false);
    }
  };

  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.scheduledAt)
    const today = new Date()
    return bookingDate.toDateString() === today.toDateString() && booking.status === 'CONFIRMED'
  })

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.scheduledAt) > new Date() && booking.status === 'CONFIRMED'
  )

  const completedBookings = bookings.filter(booking => 
    booking.status === 'COMPLETED'
  )

  // Use actual accumulated earnings from database (updated when payments are made)
  // Fallback to calculated earnings if totalEarnings is not available yet
  const totalEarnings = nurseProfile?.totalEarnings !== undefined 
    ? nurseProfile.totalEarnings 
    : completedBookings.reduce((total, booking) => {
        return total + (booking.durationMinutes * (nurseProfile?.hourlyRate || 0) / 60)
      }, 0)

  // Helper functions for enhanced dashboard
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

  const calculateTotalCost = (hourlyRate: number, durationMinutes: number) => {
    return (hourlyRate * durationMinutes) / 60
  }

  const stats = [
    {
      name: 'Today\'s Appointments',
      value: todayBookings.length,
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
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Earnings',
      value: formatCurrency(totalEarnings),
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Nurse'}!
          </h1>
          <p className="text-gray-600">
            Manage your appointments and provide quality care to your patients
          </p>
        </motion.div>

        {/* Nurse Profile Setup Prompt */}
        {profileError && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-2">No Nurse Profile Found</h2>
            <p className="text-yellow-700 mb-5">You need to create your nurse profile before your dashboard is available.</p>
            <form className="space-y-4" onSubmit={handleProfileSubmit(onProfileFormSubmit)}>
              <div>
                <Input label="Your Specialization(s)" placeholder="e.g. ICU, General, Pediatrics (separate by comma)" {...npRegister('specialization')} error={npErrors.specialization?.message} />
              </div>
              <div>
                <Input label="Location" placeholder="e.g. Mumbai" {...npRegister('location')} error={npErrors.location?.message} />
              </div>
              <div>
                <Input type="number" label="Hourly Rate (₹)" placeholder="e.g. 800" {...npRegister('hourlyRate', { valueAsNumber: true })} error={npErrors.hourlyRate?.message} />
              </div>
              <Button type="submit" loading={profileFormLoading} className="w-full">Create Profile</Button>
            </form>
          </motion.div>
        )}

        {/* Profile Status */}
        {!profileError && nurseProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className={twMerge(
              "mb-8 p-4 bg-white border rounded-lg",
              nurseProfile.approved ? "border-green-200" : "border-yellow-200",
              justSaved && "border-2 border-blue-400 shadow"
            )}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                nurseProfile.approved ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {nurseProfile.approved ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${
                  nurseProfile.approved ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  {nurseProfile.approved ? 'Profile Approved' : 'Profile Under Review'}
                </h3>
                <p className={`text-sm ${
                  nurseProfile.approved ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {nurseProfile.approved 
                    ? 'Your profile is live and patients can book appointments with you'
                    : 'Your profile is being reviewed by our admin team'
                  }
                </p>
              </div>
            </div>
            {/* My Availability Section */}
            <AvailabilityModal
              open={availabilityModalOpen}
              onClose={() => setAvailabilityModalOpen(false)}
              availability={availability}
              onSave={handleSaveAvailability}
            />
          </motion.div>
        )}

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold">{todayBookings.length}</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold">{upcomingBookings.length}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{completedBookings.length}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold">₹{totalEarnings.toFixed(0)}</p>
                <p className="text-yellow-100 text-xs mt-1">From {completedBookings.length} completed appointments</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-200" />
            </div>
          </motion.div>
        </div>

        {/* Earnings Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                loading={refreshing}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toFixed(0)}</div>
                <div className="text-sm text-green-700 font-medium">Total Accumulated</div>
                <div className="text-xs text-green-600 mt-1">
                  {nurseProfile?.totalEarnings !== undefined 
                    ? 'From successful payments' 
                    : 'Calculated from completed bookings'
                  }
                </div>
                {nurseProfile?.totalEarnings !== undefined && (
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-green-600">Live data</span>
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{completedBookings.length}</div>
                <div className="text-sm text-blue-700 font-medium">Completed Appointments</div>
                <div className="text-xs text-blue-600 mt-1">Successfully delivered</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  ₹{completedBookings.length > 0 ? (totalEarnings / completedBookings.length).toFixed(0) : '0'}
                </div>
                <div className="text-sm text-purple-700 font-medium">Average per Appointment</div>
                <div className="text-xs text-purple-600 mt-1">Based on completed bookings</div>
              </div>
            </div>
            
            {/* Recent Earnings Activity */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-4">Recent Earnings Activity</h3>
              <div className="space-y-3">
                {bookings
                  .filter(booking => booking.status === 'COMPLETED' || booking.status === 'CANCELLED')
                  .slice(0, 5)
                  .map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-full ${
                          booking.status === 'COMPLETED' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {booking.status === 'COMPLETED' ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <XMarkIcon className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.patient?.name || 'Patient'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(booking.scheduledAt)} • {booking.durationMinutes} min
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          booking.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {booking.status === 'COMPLETED' ? '+' : '-'}₹{calculateTotalCost(nurseProfile?.hourlyRate || 0, booking.durationMinutes).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.status === 'COMPLETED' ? 'Earned' : 'Refunded'}
                        </div>
                      </div>
                    </div>
                  ))}
                {bookings.filter(booking => booking.status === 'COMPLETED' || booking.status === 'CANCELLED').length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No earnings activity yet. Complete appointments to start earning!
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start" size="lg">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg" onClick={()=>setAvailabilityModalOpen(true)}>
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Set Availability
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  View Reviews
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Today's Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : todayBookings.length > 0 ? (
                <div className="space-y-4">
                  {todayBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {booking.patient?.name || 'Patient'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatTime(booking.scheduledAt)} • {booking.durationMinutes} minutes
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.patient?.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            CONFIRMED
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatCurrency(booking.durationMinutes * (nurseProfile?.hourlyRate || 0) / 60)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                  <p className="text-gray-600">You have a free day! Check your upcoming appointments.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Reviews</h2>
            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <StarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{review.patient?.name || 'Patient'}</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">No reviews yet.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


