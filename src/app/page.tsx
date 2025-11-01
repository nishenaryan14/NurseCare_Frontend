'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  HeartIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  StarIcon,
  UserGroupIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const features = [
  {
    name: '24/7 Availability',
    description: 'Access qualified nurses around the clock for your healthcare needs.',
    icon: ClockIcon,
  },
  {
    name: 'Verified Professionals',
    description: 'All nurses are thoroughly vetted and licensed healthcare professionals.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Quality Care',
    description: 'Receive compassionate, professional care in the comfort of your home.',
    icon: HeartIcon,
  },
  {
    name: 'Easy Booking',
    description: 'Simple and secure booking process with instant confirmation.',
    icon: CheckCircleIcon,
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    content: 'The nurses provided excellent care for my elderly mother. Professional, kind, and reliable.',
    rating: 5,
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Family Physician',
    content: 'NurseCare has been a game-changer for my patients who need home healthcare.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Patient',
    content: 'The booking process was so easy, and the nurse arrived exactly on time.',
    rating: 5,
  },
]

const stats = [
  { label: 'Happy Patients', value: '10,000+' },
  { label: 'Qualified Nurses', value: '500+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Years of Service', value: '5+' },
]

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return

    // Redirect to welcome page if not authenticated
    if (!user) {
      router.push('/welcome')
      return
    }

    // Redirect authenticated users to their dashboards if they're on the home page
    if (user.role === 'PATIENT') {
      router.push('/patient/dashboard')
      return
    }
    
    if (user.role === 'NURSE') {
      router.push('/nurse/dashboard')
      return
    }
  }, [user, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // This should rarely be reached as users are redirected above
  return null

  // Patient Home Page
  const PatientHomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Patient Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <HeartIcon className="w-4 h-4 mr-2" />
                Your Health Dashboard
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome back,
                <span className="text-blue-600"> {user?.name}</span>!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your health is our priority. Book appointments, manage your care, 
                and access quality nursing services whenever you need them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/patient/dashboard">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg">
                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/nurses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Book New Appointment
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-gray-600">Manage your healthcare</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link href="/patient/dashboard" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium">View My Appointments</span>
                    </div>
                  </Link>
                  <Link href="/nurses" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <UserGroupIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Find Nurses</span>
                    </div>
                  </Link>
                  <Link href="/patient/bookings" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">My Bookings</span>
                    </div>
                  </Link>
                  <Link href="/support" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Get Support</span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Health & Wellness Tips</h2>
            <p className="text-gray-600">Stay healthy with expert advice from our nursing professionals</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <HeartIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Health Monitoring</h3>
              <p className="text-gray-600 mb-4">Keep track of vital signs and symptoms for better health management.</p>
              <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Learn more →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Medication Reminders</h3>
              <p className="text-gray-600 mb-4">Never miss a dose with proper medication scheduling and reminders.</p>
              <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Learn more →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Family Care Coordination</h3>
              <p className="text-gray-600 mb-4">Coordinate care with family members and healthcare providers.</p>
              <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Learn more →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-red-50 border border-red-200 rounded-xl p-8"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-red-900 mb-2">Emergency Contacts</h3>
                <p className="text-red-800 mb-4">
                  For medical emergencies, call 911 immediately. For urgent nursing care or questions about your appointments, contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Emergency: 911
                  </Button>
                  <Link href="/support">
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                      <HeartIcon className="w-4 h-4 mr-2" />
                      Nursing Support
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )

  // Nurse Home Page
  const NurseHomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Nurse Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <HeartIcon className="w-4 h-4 mr-2" />
                Professional Dashboard
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome back,
                <span className="text-green-600"> {user?.name}</span>!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Ready to provide exceptional care? Manage your appointments, 
                update availability, and continue making a difference in patients' lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nurse/dashboard">
                  <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-lg">
                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/nurse/appointments">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    My Appointments
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Nurse Tools</h3>
                    <p className="text-gray-600">Manage your practice</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link href="/nurse/dashboard" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Today's Appointments</span>
                    </div>
                  </Link>
                  <Link href="/nurse/availability" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Set Availability</span>
                    </div>
                  </Link>
                  <Link href="/nurse/earnings" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <StarIcon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">View Earnings</span>
                    </div>
                  </Link>
                  <Link href="/support" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Get Support</span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Excellence Tips</h2>
            <p className="text-gray-600">Enhance your nursing practice with expert guidance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <HeartIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Communication</h3>
              <p className="text-gray-600 mb-4">Build trust through clear, compassionate communication with patients and families.</p>
              <Link href="/support" className="text-green-600 hover:text-green-700 font-medium">Learn more →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Management</h3>
              <p className="text-gray-600 mb-4">Optimize your schedule for maximum efficiency and better work-life balance.</p>
              <Link href="/support" className="text-green-600 hover:text-green-700 font-medium">Learn more →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Growth</h3>
              <p className="text-gray-600 mb-4">Continue learning and advancing your nursing career with ongoing education.</p>
              <Link href="/support" className="text-green-600 hover:text-green-700 font-medium">Learn more →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Earnings Highlight Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-green-900 mb-2">Maximize Your Earnings</h3>
                <p className="text-green-800 mb-4">
                  Set competitive rates, maintain high availability, and provide excellent care to increase your income. 
                  Track your progress and optimize your schedule for better earnings.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/nurse/earnings">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <StarIcon className="w-4 h-4 mr-2" />
                      View Earnings
                    </Button>
                  </Link>
                  <Link href="/nurse/availability">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      Update Availability
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )

  // Default Home Page for non-authenticated users
  const DefaultHomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Default Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional
                <span className="text-blue-600"> Home Nursing</span>
                <br />
                Care
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with qualified, compassionate nurses for personalized healthcare 
                in the comfort of your home. Book appointments, manage care, and ensure 
                your loved ones receive the best possible attention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/nurses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Find Nurses
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Nurse Available</h3>
                    <p className="text-sm text-gray-500">Sarah Johnson, RN</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Available in your area</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Next available: Today 2:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-600">4.9/5 rating (127 reviews)</span>
                  </div>
                </div>
                <Button className="w-full mt-6">
                  Book Now - ₹500/hour
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose NurseCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive home healthcare solutions with a focus on 
              quality, convenience, and compassionate care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with professional home nursing care in just a few simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Find a Nurse',
                description: 'Browse qualified nurses in your area and read reviews from other patients.',
              },
              {
                step: '2',
                title: 'Book Appointment',
                description: 'Select your preferred time slot and book your nursing care appointment.',
              },
              {
                step: '3',
                title: 'Receive Care',
                description: 'Your nurse arrives on time to provide professional healthcare at home.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from patients who trust NurseCare for their healthcare needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust NurseCare for their home healthcare needs. 
              Book your first appointment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )

}