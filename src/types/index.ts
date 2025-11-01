export interface User {
  id: number
  email: string
  name?: string
  role: 'PATIENT' | 'NURSE' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface NurseProfile {
  id: number
  userId: number
  specialization: string[]
  hourlyRate: number
  location: string
  latitude?: number
  longitude?: number
  approved: boolean
  availability?: any
  totalEarnings?: number // Accumulated earnings from successful payments
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Booking {
  id: number
  patientId: number
  nurseId: number
  scheduledAt: string
  durationMinutes: number
  status: string
  createdAt: string
  updatedAt: string
  patient?: User
  nurse?: User & { nurseProfile?: NurseProfile }
  payment?: Payment
}

export interface Payment {
  id: number
  bookingId: number
  amount: number
  currency: string
  provider: string
  providerPaymentId?: string
  status: string // PENDING, SUCCESS, FAILED, REFUNDED
  refundedAt?: string // When the payment was refunded
  refundAmount?: number // Amount refunded (can be partial)
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: number
  rating: number
  comment?: string
  patientId: number
  nurseId: number
  createdAt: string
  patient?: User
  nurse?: NurseProfile
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
  role: 'PATIENT' | 'NURSE' | 'ADMIN'
}

export interface CreateBookingRequest {
  nurseId: number
  scheduledAt: string
  durationMinutes: number
}

export interface CreateReviewRequest {
  nurseId: number
  rating: number
  comment?: string
}

