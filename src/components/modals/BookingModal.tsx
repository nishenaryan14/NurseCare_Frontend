'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { NurseProfile } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import dayjs from 'dayjs';

const bookingSchema = z.object({
  scheduledAt: z.string().min(1, 'Please select a date and time'),
  durationMinutes: z.number().min(30, 'Minimum duration is 30 minutes').max(480, 'Maximum duration is 8 hours'),
})

type BookingForm = z.infer<typeof bookingSchema>

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  nurse?: NurseProfile | null
  onBookingCreated?: (booking: any) => void
}

export default function BookingModal({ isOpen, onClose, nurse, onBookingCreated }: BookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availability, setAvailability] = useState<any>({})
  const [availLoading, setAvailLoading] = useState(true)

  // If nurse is not provided, do not render modal content
  const nurseId = nurse?.id;

  // Fetch nurse availability on open
  React.useEffect(() => {
    if (isOpen && nurseId) {
      setAvailLoading(true)
      api.get(`/nurses/availability/${nurseId}`)
        .then(res => {
          console.log('Availability response:', JSON.stringify(res.data, null, 2))
          console.log('Availability data:', res.data.availability)
          setAvailability(res.data.availability || {})
        })
        .catch(error => {
          console.error('Failed to fetch availability:', error)
          console.error('Error details:', error.response?.data)
          toast.error('Failed to load nurse availability. Please try again.')
          setAvailability({})
        })
        .finally(() => setAvailLoading(false))
    }
  }, [isOpen, nurseId])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  })

  const safeHourlyRate = typeof nurse?.hourlyRate === 'number' ? nurse!.hourlyRate : 0
  const duration = watch('durationMinutes') || 60
  const totalAmount = (duration / 60) * safeHourlyRate

  const onSubmit = async (data: BookingForm) => {
    if (!nurse?.user?.id) return; // safety
    setLoading(true)
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString()
      const res = await api.post('/bookings', {
        nurseId: nurse.user.id,
        scheduledAt,
        durationMinutes: data.durationMinutes,
      })
      const booking = res.data;
      toast.success('Booking created successfully!')
      onBookingCreated?.(booking)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    if (selectedTime) {
      setValue('scheduledAt', `${date}T${selectedTime}`)
    }
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      setValue('scheduledAt', `${selectedDate}T${time}`)
    }
  }

  const availableHours: number[] = React.useMemo(() => {
    if (!selectedDate || !availability) return [];
    const jsDay = dayjs(selectedDate).day();
    const dayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const dayLabel = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][dayIdx];
    return Array.isArray(availability[dayLabel]) ? availability[dayLabel] : [];
  }, [selectedDate, availability])

  const availTimeSlots = availableHours.map(hour => `${hour.toString().padStart(2,'0')}:00`)

  React.useEffect(() => {
    if (selectedTime && !availTimeSlots.includes(selectedTime)) {
      setSelectedTime('');
      setValue('scheduledAt', '');
    }
  }, [availTimeSlots, selectedTime, setValue])

  // If no nurse, render nothing (safety)
  if (!nurse) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {nurse.user?.name?.charAt(0) || 'N'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{nurse.user?.name || 'Nurse'}</h3>
                    <p className="text-sm text-gray-600">{nurse.location || '—'}</p>
                    <p className="text-sm text-gray-600">{safeHourlyRate ? formatCurrency(safeHourlyRate) + '/hour' : '—'}</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* date/time/duration inputs unchanged */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <select value={selectedTime} onChange={(e) => handleTimeChange(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required disabled={!selectedDate || availLoading}>
                    <option value="">{availLoading ? 'Loading...' : 'Choose a time'}</option>
                    {Array(availableHours.length === 0 && !availLoading ? <option key="na" value="" disabled>No available time</option> : null)}
                    {availTimeSlots.map(t => (<option key={t} value={t}>{t}</option>))}
                  </select>
                  {errors.durationMinutes && (<p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select {...register('durationMinutes', { valueAsNumber: true })} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={360}>6 hours</option>
                    <option value={480}>8 hours</option>
                  </select>
                  {errors.durationMinutes && (<p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>)}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Payment will be processed after booking confirmation</p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                  <Button type="submit" loading={loading} className="flex-1">Book Now</Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}


