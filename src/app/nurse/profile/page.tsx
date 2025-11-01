'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

export default function NurseProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    licenseNumber: '',
    yearsExperience: '',
    specializations: '',
    hourlyRate: '',
    bio: '',
    education: '',
    certifications: '',
    languages: '',
    availability: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    console.log('Saving profile data:', formData)
    setIsEditing(false)
    // Update user context if needed
    if (user) {
      updateUser({ ...user, name: formData.name, email: formData.email })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      licenseNumber: '',
      yearsExperience: '',
      specializations: '',
      hourlyRate: '',
      bio: '',
      education: '',
      certifications: '',
      languages: '',
      availability: ''
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Nurse Profile</h1>
                  <p className="text-gray-600">Manage your professional information and settings</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.name || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.email || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Area
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your service area"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="Enter your license number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.licenseNumber || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                        placeholder="Years of experience"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.yearsExperience ? `${formData.yearsExperience} years` : 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate ($)
                    </label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        placeholder="Enter your hourly rate"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.hourlyRate ? `$${formData.hourlyRate}/hour` : 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.languages}
                        onChange={(e) => handleInputChange('languages', e.target.value)}
                        placeholder="e.g., English, Spanish"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.languages || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specializations
                    </label>
                    {isEditing ? (
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={2}
                        value={formData.specializations}
                        onChange={(e) => handleInputChange('specializations', e.target.value)}
                        placeholder="e.g., Pediatric Care, Wound Care, Post-Operative Care"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.specializations || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Education & Certifications
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    {isEditing ? (
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        value={formData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        placeholder="List your nursing education and degrees"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.education || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    {isEditing ? (
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        value={formData.certifications}
                        onChange={(e) => handleInputChange('certifications', e.target.value)}
                        placeholder="List your professional certifications"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.certifications || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <HeartIcon className="w-5 h-5 mr-2 text-red-600" />
                  Professional Bio
                </h2>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell patients about yourself, your experience, and your approach to care..."
                  />
                ) : (
                  <p className="text-gray-900 py-2 leading-relaxed">{formData.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Statistics */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <StarIcon className="w-5 h-5 mr-2 text-yellow-600" />
                  Profile Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="text-yellow-600 font-medium">4.9 ★</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Patients</span>
                    <span className="text-green-600 font-medium">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed Jobs</span>
                    <span className="text-blue-600 font-medium">245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="text-green-600 font-medium">98%</span>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                  Verification Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Identity</span>
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">License</span>
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Background Check</span>
                    <span className="text-green-600 font-medium">✓ Passed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="text-green-600 font-medium">✓ Active</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarDaysIcon className="w-4 h-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                    View Earnings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <StarIcon className="w-4 h-4 mr-2" />
                    View Reviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>

              {/* Professional Notice */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Professional Standards</h3>
                <p className="text-sm text-green-800">
                  Maintain your professional credentials and continue education to provide the best care for your patients.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
