'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { 
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const daysOfWeek = [
  { key: 'Mon', label: 'Monday' },
  { key: 'Tue', label: 'Tuesday' },
  { key: 'Wed', label: 'Wednesday' },
  { key: 'Thu', label: 'Thursday' },
  { key: 'Fri', label: 'Friday' },
  { key: 'Sat', label: 'Saturday' },
  { key: 'Sun', label: 'Sunday' },
]

const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8 // 8 AM to 8 PM
  return {
    value: hour,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  }
})

export default function NurseAvailability() {
  const { user } = useAuth()
  const [availability, setAvailability] = useState<Record<string, number[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nurseProfile, setNurseProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      setError(null)
      // First fetch nurse profile from backend
      const profileResponse = await api.get('/nurses/me')
      const profile = profileResponse.data
      setNurseProfile(profile)
      
      // Then fetch availability using the profile ID
      if (profile?.id) {
        await fetchAvailability(profile.id)
      } else {
        setError('Nurse profile not found. Please complete your profile setup.')
      }
    } catch (error: any) {
      console.error('Failed to initialize data:', error)
      const errorMessage = error.response?.data?.message || 'Failed to load availability data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailability = async (nurseId?: number) => {
    try {
      const id = nurseId || nurseProfile?.id
      if (id) {
        // Use correct backend endpoint: GET /nurses/availability/:id
        const response = await api.get(`/nurses/availability/${id}`)
        setAvailability(response.data.availability || {})
      }
    } catch (error: any) {
      console.error('Failed to fetch availability:', error)
      // Fallback to localStorage if API fails
      if (error.response?.status === 404) {
        console.log('Availability not found, using empty availability')
      }
      setAvailability({})
    }
  }

  const toggleSlot = (day: string, hour: number) => {
    setAvailability(prev => {
      const copy = { ...prev }
      if (!copy[day]) copy[day] = []
      
      if (copy[day].includes(hour)) {
        copy[day] = copy[day].filter(h => h !== hour)
      } else {
        copy[day] = [...copy[day], hour].sort((a, b) => a - b)
      }
      
      return copy
    })
  }

  const saveAvailability = async () => {
    if (!nurseProfile?.id) {
      toast.error('Nurse profile not found')
      return
    }

    setSaving(true)
    try {
      // Use correct backend endpoint: PATCH /nurses/availability
      await api.patch('/nurses/availability', { availability })
      toast.success('Availability updated successfully!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update availability'
      toast.error(errorMessage)
      console.error('Failed to save availability:', error)
    } finally {
      setSaving(false)
    }
  }

  const clearAll = () => {
    setAvailability({})
  }

  const selectAllWeekdays = () => {
    // Select 9 AM to 6 PM for weekdays (Monday to Friday)
    const workingHours = timeSlots.filter(slot => slot.value >= 9 && slot.value <= 18).map(slot => slot.value)
    const weekdayAvailability = daysOfWeek.slice(0, 5).reduce((acc, day) => {
      acc[day.key] = workingHours
      return acc
    }, {} as Record<string, number[]>)
    
    setAvailability(weekdayAvailability)
  }

  const selectAllDays = () => {
    // Select 9 AM to 6 PM for all days
    const workingHours = timeSlots.filter(slot => slot.value >= 9 && slot.value <= 18).map(slot => slot.value)
    const allDayAvailability = daysOfWeek.reduce((acc, day) => {
      acc[day.key] = workingHours
      return acc
    }, {} as Record<string, number[]>)
    
    setAvailability(allDayAvailability)
  }

  const getTotalHours = () => {
    return Object.values(availability).reduce((total, slots) => total + slots.length, 0)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Availability</h1>
          <p className="text-gray-600">
            Set your available hours so patients can book appointments with you
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center">
                <XMarkIcon className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Error Loading Availability</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <Button 
                    onClick={initializeData} 
                    className="mt-3 bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        {!error && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Hours/Week</p>
                <p className="text-3xl font-bold">{getTotalHours()}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Days</p>
                <p className="text-3xl font-bold">{Object.keys(availability).filter(day => availability[day]?.length > 0).length}</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Hourly Rate</p>
                <p className="text-3xl font-bold">₹{nurseProfile?.hourlyRate || 0}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={selectAllWeekdays}
                className="flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Select Weekdays (9 AM - 6 PM)
              </Button>
              <Button
                variant="outline"
                onClick={selectAllDays}
                className="flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Select All Days (9 AM - 6 PM)
              </Button>
              <Button
                variant="outline"
                onClick={clearAll}
                className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Availability Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Set Your Available Hours</h2>
              <p className="text-sm text-gray-600">Click on time slots to toggle availability</p>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-md font-medium text-gray-900 mb-3">{day.label}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = availability[day.key]?.includes(slot.value) || false
                        return (
                          <button
                            key={slot.value}
                            onClick={() => toggleSlot(day.key, slot.value)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {slot.label}
                          </button>
                        )
                      })}
                    </div>
                    {availability[day.key]?.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        {availability[day.key].length} hours selected
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={saveAvailability}
            loading={saving}
            disabled={saving || getTotalHours() === 0}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            {saving ? 'Saving...' : 'Save Availability'}
          </Button>
        </motion.div>
        </>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Setting Availability</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Set consistent hours to help patients plan their appointments</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Update your availability regularly to reflect your current schedule</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Consider peak hours when patients are most likely to need care</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Leave buffer time between appointments for travel and preparation</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
