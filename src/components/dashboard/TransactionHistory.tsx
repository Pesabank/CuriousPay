'use client'

import { useState } from 'react'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Calendar,
  Filter,
  Download
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'payment' | 'transfer' | 'refund'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  description: string
  cardLast4: string
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: 'tx_1',
    type: 'payment',
    amount: 156.78,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-17T10:30:00',
    description: 'Payment to Merchant XYZ',
    cardLast4: '4532'
  },
  {
    id: 'tx_2',
    type: 'transfer',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-16T15:45:00',
    description: 'Transfer to External Wallet',
    cardLast4: '8901'
  },
  {
    id: 'tx_3',
    type: 'refund',
    amount: 25.99,
    currency: 'USD',
    status: 'pending',
    date: '2025-02-16T09:15:00',
    description: 'Refund from Store ABC',
    cardLast4: '4532'
  }
]

export function TransactionHistory() {
  const [transactions] = useState<Transaction[]>(sampleTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case 'transfer':
        return <ArrowDownRight className="h-4 w-4 text-yellow-400" />
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-green-400" />
      default:
        return null
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.cardLast4.includes(searchTerm)
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleExport = () => {
    const csvData = [
      // CSV Headers
      ['Date', 'Type', 'Description', 'Amount', 'Card', 'Status'].join(','),
      // CSV Rows
      ...filteredTransactions.map(tx => [
        new Date(tx.date).toLocaleString(),
        tx.type,
        `"${tx.description}"`, // Wrap description in quotes to handle commas
        tx.amount.toFixed(2),
        `••••${tx.cardLast4}`,
        tx.status
      ].join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white pl-10 pr-4 py-2"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="payment">Payments</option>
            <option value="transfer">Transfers</option>
            <option value="refund">Refunds</option>
          </select>

          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Card
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTypeIcon(tx.type)}
                    <span className="ml-2 text-white capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {tx.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  •••• {tx.cardLast4}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`capitalize ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {new Date(tx.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
