'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NurseProfile } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  MapPinIcon, 
  StarIcon,
  ClockIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'
import BookingModal from '@/components/modals/BookingModal';
import MockPaymentModal from '../patient/dashboard/MockPaymentModal';
import toast from 'react-hot-toast';

export default function NursesPage() {
  const [nurses, setNurses] = useState<NurseProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeNurse, setActiveNurse] = useState<NurseProfile | null>(null);
  const [payModalBooking, setPayModalBooking] = useState<any>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedSpecialization) params.append('specialization', selectedSpecialization)
        if (selectedLocation) params.append('location', selectedLocation)
        if (maxRate) params.append('maxRate', maxRate)

        const response = await api.get(`/nurses/approved?${params.toString()}`)
        setNurses(response.data)
      } catch (error) {
        console.error('Failed to fetch nurses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNurses()
  }, [selectedSpecialization, selectedLocation, maxRate])

  const filteredNurses = nurses.filter(nurse => {
    const matchesSearch = nurse.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nurse.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const specializations = Array.from(new Set(nurses.flatMap(nurse => nurse.specialization)))
  const locations = Array.from(new Set(nurses.map(nurse => nurse.location)))

  const handleBookClick = (nurse: NurseProfile) => {
    setActiveNurse(nurse);
    setBookingModalOpen(true);
  };
  const handleBookingCreated = (booking: any) => {
    if (booking && booking.status === 'PENDING_PAYMENT') {
      setPayModalBooking(booking);
      setPayModalOpen(true);
    }
  };
  const closePayModal = () => {
    setPayModalOpen(false);
    setPayModalBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6"
          >
            <HeartIcon className="w-4 h-4 mr-2" />
            Verified Healthcare Professionals
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Find Qualified Nurses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with professional, licensed nurses for personalized home healthcare services
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search nurses or specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Max hourly rate"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : filteredNurses.length > 0 ? (
            filteredNurses.map((nurse, index) => (
              <motion.div
                key={nurse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                <div className="text-center mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow"
                  >
                    <HeartIcon className="h-12 w-12 text-blue-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {nurse.user?.name || 'Nurse'}
                  </h3>
                  <p className="text-sm text-gray-500">{nurse.user?.email || 'Not available'}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPinIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{nurse.location || '—'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ClockIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {typeof nurse.hourlyRate === 'number' ? formatCurrency(nurse.hourlyRate) + '/hour' : '—'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">4.8 (127)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {(nurse.specialization || []).map((spec, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                      >
                        {spec}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg group-hover:shadow-xl" 
                  onClick={() => handleBookClick(nurse)}
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Book Appointment
                </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No nurses found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-xl shadow-md"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-gray-700 font-medium">Qualified Nurses</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-xl shadow-md"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-gray-700 font-medium">Cities Covered</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-xl shadow-md"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">10,000+</div>
              <div className="text-gray-700 font-medium">Happy Patients</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-xl shadow-md"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">4.9/5</div>
              <div className="text-gray-700 font-medium">Average Rating</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {bookingModalOpen && activeNurse && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          nurse={activeNurse}
          onBookingCreated={handleBookingCreated}
        />
      )}
      <MockPaymentModal
        open={payModalOpen}
        onClose={closePayModal}
        booking={payModalBooking}
        onSuccess={() => {
          toast.success('Payment completed successfully! Your booking is confirmed.');
          closePayModal();
          // Optionally refresh the page or redirect to bookings
        }}
      />
    </div>
  )
}


