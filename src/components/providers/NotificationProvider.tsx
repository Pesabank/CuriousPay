'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Shield,
  CreditCard,
  Wallet,
  Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type NotificationType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'security' 
  | 'payment' 
  | 'wallet' 
  | 'auth'

export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: {
    amount?: string
    merchant?: string
    location?: string
    time?: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  position: NotificationPosition
  setPosition: (position: NotificationPosition) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [position, setPosition] = useState<NotificationPosition>('top-right')

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />
      case 'security':
        return <Shield className="h-5 w-5 text-purple-400" />
      case 'payment':
        return <CreditCard className="h-5 w-5 text-emerald-400" />
      case 'wallet':
        return <Wallet className="h-5 w-5 text-indigo-400" />
      case 'auth':
        return <Lock className="h-5 w-5 text-pink-400" />
    }
  }

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 shadow-green-500/5'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/5'
      case 'error':
        return 'bg-red-500/10 border-red-500/20 shadow-red-500/5'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 shadow-blue-500/5'
      case 'security':
        return 'bg-purple-500/10 border-purple-500/20 shadow-purple-500/5'
      case 'payment':
        return 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5'
      case 'wallet':
        return 'bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5'
      case 'auth':
        return 'bg-pink-500/10 border-pink-500/20 shadow-pink-500/5'
    }
  }

  const getPositionStyles = (position: NotificationPosition) => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
    }
  }

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id)
      }, notifications[0].duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [notifications])

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification, 
        clearAll, 
        position, 
        setPosition 
      }}
    >
      {children}
      <div className={`fixed z-50 space-y-4 ${getPositionStyles(position)}`}>
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`flex items-start p-4 rounded-lg border ${getNotificationStyles(
                notification.type
              )} shadow-lg backdrop-blur-sm max-w-sm w-full transform transition-all duration-300 ease-in-out`}
            >
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-white">{notification.title}</p>
                <p className="mt-1 text-sm text-gray-400">{notification.message}</p>
                {notification.metadata && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    {notification.metadata.amount && (
                      <p>Amount: {notification.metadata.amount}</p>
                    )}
                    {notification.metadata.merchant && (
                      <p>Merchant: {notification.metadata.merchant}</p>
                    )}
                    {notification.metadata.location && (
                      <p>Location: {notification.metadata.location}</p>
                    )}
                    {notification.metadata.time && (
                      <p>Time: {notification.metadata.time}</p>
                    )}
                  </div>
                )}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-sm font-medium text-primary hover:text-primary/90"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}
