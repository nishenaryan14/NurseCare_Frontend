'use client'

import { useEffect } from 'react'

export default function LandingRedirect() {
  useEffect(() => {
    window.location.href = '/welcome'
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to welcome page...</p>
      </div>
    </div>
  )
}
