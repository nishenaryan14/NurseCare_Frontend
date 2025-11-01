'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          // Decode token to restore user info on page refresh
          const payload = JSON.parse(atob(token.split('.')[1]))
          const userData = {
            id: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            role: payload.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setUser(userData)
          setLoading(false)
        } catch (error) {
          // Invalid token, clear storage
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          setUser(null)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data)
      const { accessToken, refreshToken } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      // Decode token to get user info (simplified)
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        role: payload.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUser(userData)
      
      toast.success('Login successful!')
      
      // Let the main page handle the redirect based on user role
      // This prevents double redirects and page refreshes
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      await api.post('/auth/register', data)
      toast.success('Registration successful! Please login.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    toast.success('Logged out successfully')
    
    // Redirect to welcome page after logout
    setTimeout(() => {
      window.location.href = '/welcome'
    }, 500)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
