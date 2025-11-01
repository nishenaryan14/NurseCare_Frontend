'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { 
  HeartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const benefits = [
  {
    icon: CurrencyDollarIcon,
    title: 'Competitive Earnings',
    description: 'Set your own rates and earn more with flexible scheduling. Average nurses earn ₹800-1500 per hour.',
    color: 'bg-green-500'
  },
  {
    icon: ClockIcon,
    title: 'Flexible Schedule',
    description: 'Work when you want, where you want. Set your availability and take control of your work-life balance.',
    color: 'bg-blue-500'
  },
  {
    icon: UserGroupIcon,
    title: 'Growing Patient Base',
    description: 'Access thousands of patients who need quality nursing care in the comfort of their homes.',
    color: 'bg-purple-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified Platform',
    description: 'Join a trusted platform with verified patients, secure payments, and professional support.',
    color: 'bg-indigo-500'
  }
]

const features = [
  {
    icon: CalendarDaysIcon,
    title: 'Easy Scheduling',
    description: 'Manage your appointments with our intuitive calendar system'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Instant Payments',
    description: 'Get paid weekly with direct bank transfers'
  },
  {
    icon: StarIcon,
    title: 'Build Your Reputation',
    description: 'Receive reviews and build a strong professional profile'
  },
  {
    icon: HeartIcon,
    title: 'Make a Difference',
    description: 'Provide quality care and improve patients\' lives'
  }
]

const steps = [
  {
    step: '1',
    title: 'Create Your Profile',
    description: 'Sign up and complete your professional nursing profile with certifications and experience.'
  },
  {
    step: '2',
    title: 'Get Verified',
    description: 'Our team reviews your credentials and approves qualified nurses within 24-48 hours.'
  },
  {
    step: '3',
    title: 'Set Availability',
    description: 'Choose your working hours and days. Update anytime to match your schedule.'
  },
  {
    step: '4',
    title: 'Start Earning',
    description: 'Receive booking requests, provide excellent care, and build your patient base.'
  }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Registered Nurse',
    content: 'This platform has given me the flexibility I needed while earning more than my hospital job. The patients are wonderful and the support team is always helpful.',
    rating: 5,
    image: '/api/placeholder/64/64'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Critical Care Nurse',
    content: 'I love being able to set my own schedule and rates. The verification process made me feel confident about the platform\'s professionalism.',
    rating: 5,
    image: '/api/placeholder/64/64'
  },
  {
    name: 'Anita Patel',
    role: 'Home Care Specialist',
    content: 'The weekly payments and easy booking system make this the best nursing platform I\'ve used. Highly recommend to fellow nurses.',
    rating: 5,
    image: '/api/placeholder/64/64'
  }
]

const stats = [
  { label: 'Active Nurses', value: '500+' },
  { label: 'Average Hourly Rate', value: '₹1,200' },
  { label: 'Weekly Earnings', value: '₹15,000+' },
  { label: 'Patient Satisfaction', value: '4.9/5' }
]

export default function ForNurses() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Join Our
                <span className="text-green-600"> Nursing</span>
                <br />
                Community
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Earn more, work flexibly, and make a meaningful impact in patients' lives. 
                Join hundreds of nurses who have transformed their careers with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Join as a Nurse
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50">
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Start Your Journey</h3>
                  <p className="text-gray-600">Join thousands of satisfied nurses</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Discover the benefits that make us the preferred choice for nursing professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
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
              How to Get Started
            </h2>
            <p className="text-xl text-gray-600">
              Join our platform in just a few simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRightIcon className="w-6 h-6 text-gray-400 mx-auto mt-4 hidden lg:block" />
                )}
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
              Platform Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your nursing practice
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
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
              What Nurses Say About Us
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our community of successful nursing professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <UserGroupIcon className="w-6 h-6 text-green-600" />
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Nursing Career?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join our community of successful nurses and start earning more while making a difference in patients' lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Sign Up as a Nurse
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-600">
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
