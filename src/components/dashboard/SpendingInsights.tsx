'use client'

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ArrowUp, ArrowDown, TrendingUp, DollarSign } from 'lucide-react'

interface Transaction {
  id: string
  type: 'payment' | 'transfer' | 'refund'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  description: string
  cardLast4: string
  category: string
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

export function SpendingInsights({ transactions }: { transactions: Transaction[] }) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  const spendingByCategory = useMemo(() => {
    const categories = transactions.reduce((acc, tx) => {
      if (tx.status === 'completed' && tx.type === 'payment') {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }))
  }, [transactions])

  const dailySpending = useMemo(() => {
    const spending = transactions.reduce((acc, tx) => {
      if (tx.status === 'completed' && tx.type === 'payment') {
        const date = new Date(tx.date).toLocaleDateString()
        acc[date] = (acc[date] || 0) + tx.amount
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(spending).map(([date, amount]) => ({
      date,
      amount
    }))
  }, [transactions])

  const totalSpent = useMemo(() => {
    return transactions.reduce((total, tx) => {
      if (tx.status === 'completed' && tx.type === 'payment') {
        return total + tx.amount
      }
      return total
    }, 0)
  }, [transactions])

  const averageTransaction = useMemo(() => {
    const completedPayments = transactions.filter(
      tx => tx.status === 'completed' && tx.type === 'payment'
    )
    return completedPayments.length
      ? totalSpent / completedPayments.length
      : 0
  }, [transactions, totalSpent])

  const spendingTrend = useMemo(() => {
    const sortedSpending = [...dailySpending].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    if (sortedSpending.length < 2) return 0

    const firstHalf = sortedSpending.slice(0, Math.floor(sortedSpending.length / 2))
    const secondHalf = sortedSpending.slice(Math.floor(sortedSpending.length / 2))

    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.amount, 0) / firstHalf.length
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.amount, 0) / secondHalf.length

    return ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
  }, [dailySpending])

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Total Spent</p>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Average Transaction</p>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${averageTransaction.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Spending Trend</p>
            {spendingTrend > 0 ? (
              <ArrowUp className="h-5 w-5 text-red-400" />
            ) : (
              <ArrowDown className="h-5 w-5 text-green-400" />
            )}
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {Math.abs(spendingTrend).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {spendingTrend > 0 ? 'Increase' : 'Decrease'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Top Category</p>
            <div className="h-5 w-5 rounded-full bg-primary" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {spendingByCategory[0]?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            ${spendingByCategory[0]?.value.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Over Time */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Spending Over Time</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-gray-700 border-gray-600 rounded-md text-white px-3 py-1"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-6">
            Spending by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {spendingByCategory.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
