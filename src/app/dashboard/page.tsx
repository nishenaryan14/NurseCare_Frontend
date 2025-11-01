'use client'

import React from 'react'
import PatientDashboard from '@/components/dashboard/PatientDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DashboardPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/welcome')
    } else if (!loading && user && user.role !== 'PATIENT') {
      router.push('/') // Redirect non-patients to home
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'PATIENT') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientDashboard />
    </div>
  )
}

export default DashboardPage
