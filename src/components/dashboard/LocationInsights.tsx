'use client'

import { useMemo } from 'react'
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
import { MapPin, Globe, TrendingUp, AlertTriangle } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  location: {
    city: string
    country: string
    coordinates: [number, number]
  }
  date: string
  riskScore: number
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

export function LocationInsights({ transactions }: { transactions: Transaction[] }) {
  const locationMetrics = useMemo(() => {
    const metrics = transactions.reduce((acc, tx) => {
      const locationKey = `${tx.location.city}, ${tx.location.country}`
      
      if (!acc[locationKey]) {
        acc[locationKey] = {
          name: locationKey,
          totalSpent: 0,
          transactionCount: 0,
          averageAmount: 0,
          riskScore: 0,
          country: tx.location.country,
          coordinates: tx.location.coordinates
        }
      }

      const location = acc[locationKey]
      location.totalSpent += tx.amount
      location.transactionCount += 1
      location.riskScore = Math.max(location.riskScore, tx.riskScore)

      return acc
    }, {} as Record<string, any>)

    return Object.values(metrics).map(location => ({
      ...location,
      averageAmount: location.totalSpent / location.transactionCount
    }))
  }, [transactions])

  const countryMetrics = useMemo(() => {
    const metrics = transactions.reduce((acc, tx) => {
      if (!acc[tx.location.country]) {
        acc[tx.location.country] = {
          name: tx.location.country,
          value: 0,
          transactionCount: 0
        }
      }

      acc[tx.location.country].value += tx.amount
      acc[tx.location.country].transactionCount += 1

      return acc
    }, {} as Record<string, any>)

    return Object.values(metrics)
  }, [transactions])

  const topLocations = useMemo(() => {
    return [...locationMetrics]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
  }, [locationMetrics])

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Unique Locations</h3>
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {locationMetrics.length}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Countries</h3>
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {countryMetrics.length}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Avg. per Location</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            ${(transactions.reduce((sum, tx) => sum + tx.amount, 0) / locationMetrics.length).toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">High Risk Areas</h3>
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {locationMetrics.filter(l => l.riskScore > 0.7).length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-6">Top Locations by Spend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLocations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                <Bar dataKey="totalSpent" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-6">Spending by Country</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryMetrics}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {countryMetrics.map((_, index) => (
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

      {/* Location Details */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-6">Location Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg. Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {locationMetrics.map((location, idx) => (
                <tr key={location.name} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {location.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {location.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${location.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {location.transactionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${location.averageAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        location.riskScore > 0.7
                          ? 'bg-red-500/10 text-red-400'
                          : location.riskScore > 0.4
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}
                    >
                      {(location.riskScore * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
