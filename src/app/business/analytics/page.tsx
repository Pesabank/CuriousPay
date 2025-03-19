'use client'

import { useState, useEffect } from 'react'
import { SpendingInsights } from '@/components/dashboard/SpendingInsights'
import { useNotifications } from '@/components/providers/NotificationProvider'

// Mock data for transactions
const mockTransactions = [
  {
    id: '1',
    type: 'payment' as const,
    amount: 120.50,
    currency: 'USD',
    status: 'completed' as const,
    date: '2023-09-01T10:30:00Z',
    description: 'Payment for services',
    cardLast4: '4242',
    category: 'Business Services'
  },
  {
    id: '2',
    type: 'transfer' as const,
    amount: 500.00,
    currency: 'USD',
    status: 'completed' as const,
    date: '2023-09-03T14:15:00Z',
    description: 'Transfer to bank account',
    cardLast4: '',
    category: 'Transfer'
  },
  {
    id: '3',
    type: 'payment' as const,
    amount: 75.20,
    currency: 'USD',
    status: 'completed' as const,
    date: '2023-09-05T09:45:00Z',
    description: 'Office supplies',
    cardLast4: '4242',
    category: 'Office Expenses'
  },
  {
    id: '4',
    type: 'refund' as const,
    amount: 25.00,
    currency: 'USD',
    status: 'completed' as const,
    date: '2023-09-07T11:20:00Z',
    description: 'Refund for returned item',
    cardLast4: '4242',
    category: 'Refund'
  },
  {
    id: '5',
    type: 'payment' as const,
    amount: 1200.00,
    currency: 'USD',
    status: 'completed' as const,
    date: '2023-09-10T16:30:00Z',
    description: 'Monthly rent',
    cardLast4: '4242',
    category: 'Rent'
  }
]

export default function AnalyticsPage() {
  const notifications = useNotifications()
  const [transactions, setTransactions] = useState(mockTransactions)

  // Simulate receiving a new transaction
  const simulateNewTransaction = () => {
    const newTransaction = {
      id: `tx_${Math.random().toString(36).substring(2, 10)}`,
      type: 'payment' as const,
      amount: Math.floor(Math.random() * 100) + 10,
      currency: 'USD',
      status: 'completed' as const,
      date: new Date().toISOString(),
      description: 'New transaction',
      cardLast4: '4242',
      category: 'Misc'
    }
    
    setTransactions(prev => [...prev, newTransaction])
    
    if (notifications) {
      notifications.addNotification({
        type: 'payment',
        title: 'New Transaction',
        message: `$${newTransaction.amount.toFixed(2)} payment received`,
        duration: 5000
      })
    }
  }
  
  // Simulate new transaction every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      simulateNewTransaction()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Business Analytics</h1>
      <SpendingInsights transactions={transactions} />
    </div>
  )
}
