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
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'
import { MapPin, Building, TrendingUp, AlertTriangle } from 'lucide-react'

interface Transaction {
  id: string
  merchantName: string
  merchantCategory: string
  amount: number
  date: string
  location: {
    city: string
    country: string
    coordinates: [number, number]
  }
  riskScore: number
}

interface MerchantAnalyticsProps {
  transactions: Transaction[]
}

export function MerchantAnalytics({ transactions }: MerchantAnalyticsProps) {
  const merchantMetrics = useMemo(() => {
    const metrics = transactions.reduce((acc, tx) => {
      if (!acc[tx.merchantName]) {
        acc[tx.merchantName] = {
          name: tx.merchantName,
          totalSpent: 0,
          transactionCount: 0,
          averageAmount: 0,
          category: tx.merchantCategory,
          riskScore: 0,
          locations: new Set<string>()
        }
      }

      const merchant = acc[tx.merchantName]
      merchant.totalSpent += tx.amount
      merchant.transactionCount += 1
      merchant.riskScore = Math.max(merchant.riskScore, tx.riskScore)
      merchant.locations.add(`${tx.location.city}, ${tx.location.country}`)

      return acc
    }, {} as Record<string, any>)

    return Object.values(metrics).map(merchant => ({
      ...merchant,
      averageAmount: merchant.totalSpent / merchant.transactionCount,
      locationCount: merchant.locations.size,
      locations: Array.from(merchant.locations)
    }))
  }, [transactions])

  const topMerchants = useMemo(() => {
    return [...merchantMetrics]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
  }, [merchantMetrics])

  const riskDistribution = useMemo(() => {
    return merchantMetrics.map(merchant => ({
      x: merchant.averageAmount,
      y: merchant.transactionCount,
      z: merchant.riskScore,
      name: merchant.name
    }))
  }, [merchantMetrics])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Unique Merchants</h3>
            <Building className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {merchantMetrics.length}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Average Transaction</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            ${(transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length).toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Locations</h3>
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {new Set(transactions.map(tx => `${tx.location.city}, ${tx.location.country}`)).size}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">High Risk Merchants</h3>
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">
            {merchantMetrics.filter(m => m.riskScore > 0.7).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-6">Top Merchants by Spend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMerchants}>
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
          <h3 className="text-lg font-medium text-white mb-6">Risk Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="x"
                  name="Average Amount"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis
                  dataKey="y"
                  name="Transaction Count"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <ZAxis
                  dataKey="z"
                  range={[50, 400]}
                  name="Risk Score"
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Scatter
                  data={riskDistribution}
                  fill="#10B981"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-6">Merchant Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg. Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Locations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Risk Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {merchantMetrics.map((merchant, idx) => (
                <tr key={merchant.name} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {merchant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {merchant.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${merchant.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${merchant.averageAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    <div className="max-w-xs truncate">
                      {merchant.locations.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        merchant.riskScore > 0.7
                          ? 'bg-red-500/10 text-red-400'
                          : merchant.riskScore > 0.4
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}
                    >
                      {(merchant.riskScore * 100).toFixed(0)}%
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
