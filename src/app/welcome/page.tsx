'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { 
  HeartIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  StarIcon,
  UserGroupIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

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
    content: 'I regularly refer my patients to this platform. The quality of care is consistently outstanding.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Registered Nurse',
    content: 'Working through this platform has been amazing. Great patients and excellent support.',
    rating: 5,
  },
]

const stats = [
  { label: 'Happy Patients', value: '10,000+' },
  { label: 'Qualified Nurses', value: '500+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Years of Service', value: '5+' },
]

const services = [
  {
    title: 'Post-Operative Care',
    description: 'Professional recovery support after surgery',
    icon: HeartIcon,
    features: ['Wound care management', 'Medication administration', 'Vital signs monitoring', 'Recovery guidance']
  },
  {
    title: 'Chronic Disease Management',
    description: 'Ongoing care for long-term health conditions',
    icon: ClockIcon,
    features: ['Diabetes management', 'Blood pressure monitoring', 'Medication compliance', 'Health education']
  },
  {
    title: 'Elderly Care',
    description: 'Specialized care for senior citizens',
    icon: UserGroupIcon,
    features: ['Daily living assistance', 'Health monitoring', 'Companionship', 'Safety assessments']
  },
  {
    title: 'Pediatric Care',
    description: 'Expert nursing care for children',
    icon: StarIcon,
    features: ['Child-friendly approach', 'Vaccination support', 'Health screenings', 'Parent education']
  }
]

const howItWorks = [
  {
    step: '1',
    title: 'Find a Nurse',
    description: 'Browse qualified nurses in your area and read reviews from other patients.',
    icon: UserGroupIcon,
  },
  {
    step: '2',
    title: 'Book Appointment',
    description: 'Select your preferred time slot and confirm your booking with secure payment.',
    icon: CalendarDaysIcon,
  },
  {
    step: '3',
    title: 'Receive Care',
    description: 'Get professional nursing care in the comfort of your own home.',
    icon: HeartIcon,
  },
]

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <StarIcon className="w-4 h-4 mr-2" />
                Trusted by 10,000+ families
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional
                <span className="text-blue-600"> Home Nursing</span>
                <br />
                <span className="text-green-600">Care</span> You Can Trust
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with qualified, compassionate nurses for personalized healthcare 
                in the comfort of your home. Book appointments, manage care, and ensure 
                your loved ones receive the best possible attention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Find a Nurse
                  </Button>
                </Link>
                <Link href="/for-nurses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
                    <HeartIcon className="h-5 w-5 mr-2" />
                    Join as Nurse
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-2xl font-bold text-blue-600">4.9★</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-2xl font-bold text-green-600">24/7</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Booking</h3>
                    <p className="text-gray-600">Get started in minutes</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Choose your nurse</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Select date & time</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Secure payment</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <HeartIcon className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-blue-700 font-medium">Receive quality care</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-blue-600 mb-2"
                >
                  {stat.value}
                </motion.div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
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
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
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

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Nursing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services delivered by qualified professionals in your home
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <service.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
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
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <step.icon className="w-6 h-6 text-gray-600" />
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRightIcon className="w-6 h-6 text-gray-400 absolute top-8 -right-4 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by patients, healthcare providers, and nursing professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience Quality Home Healthcare?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients and healthcare professionals. 
              Get started today and experience the difference quality care makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg bg-white text-blue-600 hover:bg-gray-100">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Get Started Today
                </Button>
              </Link>
              <Link href="/nurses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Browse Nurses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
