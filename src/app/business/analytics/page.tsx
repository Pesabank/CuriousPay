'use client'

import { useState, useEffect } from 'react'
import { SpendingInsights } from '@/components/dashboard/SpendingInsights'
import { useNotifications } from '@/components/providers/NotificationProvider'

// Sample transaction data
const sampleTransactions = [
  {
    id: '1',
    type: 'payment',
    amount: 156.78,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-17T10:30:00',
    description: 'Payment to Merchant XYZ',
    cardLast4: '4532',
    category: 'retail'
  },
  {
    id: '2',
    type: 'payment',
    amount: 89.99,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-16T15:45:00',
    description: 'Restaurant Payment',
    cardLast4: '8901',
    category: 'food'
  },
  {
    id: '3',
    type: 'payment',
    amount: 299.99,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-15T09:15:00',
    description: 'Travel Booking',
    cardLast4: '4532',
    category: 'travel'
  },
  {
    id: '4',
    type: 'payment',
    amount: 45.00,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-14T14:20:00',
    description: 'Online Services',
    cardLast4: '8901',
    category: 'services'
  }
]

export default function AnalyticsPage() {
  const notifications = useNotifications()
  const [transactions] = useState(sampleTransactions)

  // Simulate receiving a new transaction
  const simulateNewTransaction = () => {
    if (notifications) {
      notifications.addNotification({
        type: 'payment',
        title: 'New Transaction',
        message: 'You have received a new payment',
        duration: 5000,
        metadata: {
          amount: '$50.00',
          merchant: 'Example Store',
          time: new Date().toLocaleTimeString()
        }
      })
    }
  }

  useEffect(() => {
    // Simulate a new transaction every 30 seconds
    const interval = setInterval(simulateNewTransaction, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Business Analytics</h1>
      <SpendingInsights transactions={transactions} />
    </div>
  )
}
