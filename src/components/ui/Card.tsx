import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  onClick?: () => void
}

export const Card = ({ children, className, hover = false, gradient = false, onClick }: CardProps) => {
  const baseClasses = 'bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300'
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' : ''
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={cn(baseClasses, hoverClasses, gradientClasses, className)}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn(baseClasses, gradientClasses, className)} onClick={onClick}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('p-6 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl', className)}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h3 className={cn('text-xl font-bold text-gray-900', className)}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={cn('text-gray-600 mt-1', className)}>
      {children}
    </p>
  )
}
