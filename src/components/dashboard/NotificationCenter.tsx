'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Bell, Check, Info, ShieldAlert, Wallet } from 'lucide-react'

type NotificationType = 'info' | 'security' | 'transaction' | 'system'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'security',
      title: 'New login detected',
      message: 'Your account was accessed from a new device in Nairobi, Kenya.',
      timestamp: '2023-03-15T10:30:00Z',
      read: false
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Payment received',
      message: 'You received 0.5 SOL from @username.',
      timestamp: '2023-03-14T15:45:00Z',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Balance update',
      message: 'Your weekly balance report is now available.',
      timestamp: '2023-03-12T09:15:00Z',
      read: true
    },
    {
      id: '4',
      type: 'system',
      title: 'System maintenance',
      message: 'Scheduled maintenance on March 20, 2023, from 2:00 AM to 4:00 AM EAT.',
      timestamp: '2023-03-10T12:00:00Z',
      read: true
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'security':
        return <ShieldAlert className="h-5 w-5 text-red-500" />
      case 'transaction':
        return <Wallet className="h-5 w-5 text-green-500" />
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="text-sm text-gray-500">
          {notifications.filter(n => !n.read).length} unread
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            You have no notifications
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`p-4 transition-colors ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="rounded-full p-1 hover:bg-gray-100"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1">{notification.message}</p>
                  <p className="mt-2 text-xs text-gray-500">{formatDate(notification.timestamp)}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 