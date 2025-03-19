'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/hooks/useTransactions'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Store, PieChart as PieChartIcon, Tag } from 'lucide-react'

interface MerchantData {
  name: string
  transactions: number
  amount: number
  date: string
  category?: string
}

interface MerchantAnalyticsProps {
  transactions: Transaction[]
}

export function MerchantAnalytics({ transactions }: MerchantAnalyticsProps) {
  // Predefined categories for merchants
  const categoryMap: Record<string, string> = {
    'Starbucks': 'Food & Drink',
    'Amazon': 'Shopping',
    'Uber': 'Transport',
    'Netflix': 'Entertainment',
    'Walmart': 'Groceries',
    'Airbnb': 'Travel',
    'Apple': 'Technology',
    'Target': 'Shopping',
    'Spotify': 'Entertainment',
    'DoorDash': 'Food & Drink',
    'Rent': 'Housing',
    'Utilities': 'Services',
  }

  // Default category for merchants not in the map
  const getCategory = (merchantName: string): string => {
    // Check for exact matches first
    if (categoryMap[merchantName]) return categoryMap[merchantName]
    
    // Try to find partial matches
    for (const [key, category] of Object.entries(categoryMap)) {
      if (merchantName.toLowerCase().includes(key.toLowerCase())) {
        return category
      }
    }
    
    return 'Other'
  }

  // Colors for categories
  const CATEGORY_COLORS: Record<string, string> = {
    'Food & Drink': '#FF6B6B',
    'Shopping': '#4ECDC4',
    'Transport': '#FFD166',
    'Entertainment': '#6A0572',
    'Groceries': '#1A936F',
    'Travel': '#3D348B',
    'Technology': '#F18F01',
    'Housing': '#C5CBE3',
    'Services': '#4056F4',
    'Other': '#98C1D9',
  }

  // Aggregate merchant data from transactions
  const merchantData = transactions
    .filter(t => t.merchant)
    .reduce((acc: Record<string, MerchantData>, transaction) => {
      const merchantName = transaction.merchant || 'Unknown'
      
      if (!acc[merchantName]) {
        acc[merchantName] = {
          name: merchantName,
          transactions: 0,
          amount: 0,
          date: transaction.date,
          category: getCategory(merchantName)
        }
      }
      
      acc[merchantName].transactions += 1
      acc[merchantName].amount += transaction.amount
      
      // Keep track of most recent transaction
      const existingDate = new Date(acc[merchantName].date)
      const currentDate = new Date(transaction.date)
      if (currentDate > existingDate) {
        acc[merchantName].date = transaction.date
      }

      return acc
    }, {})

  const merchantList = Object.values(merchantData)
    .sort((a, b) => b.amount - a.amount)

  // Aggregate data by category
  const categoryData = Object.values(merchantData).reduce((acc: Record<string, number>, merchant) => {
    const category = merchant.category || 'Other'
    acc[category] = (acc[category] || 0) + merchant.amount
    return acc
  }, {})

  // Format for pie chart
  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchantList.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${merchantList.reduce((sum, m) => sum + m.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(merchantList.reduce((sum, m) => sum + m.amount, 0) / 
                Math.max(1, merchantList.reduce((sum, m) => sum + m.transactions, 0))).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Top Merchants by Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {merchantList.length === 0 ? (
                <div className="text-center text-sm text-gray-500">No merchant data available</div>
              ) : (
                merchantList.slice(0, 5).map((merchant, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                      {merchant.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{merchant.name}</p>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500 mr-2">{merchant.transactions} transactions</p>
                            {merchant.category && (
                              <Badge 
                                variant="outline" 
                                className="text-xs" 
                                style={{ 
                                  borderColor: CATEGORY_COLORS[merchant.category] || CATEGORY_COLORS['Other'],
                                  color: CATEGORY_COLORS[merchant.category] || CATEGORY_COLORS['Other'],
                                }}
                              >
                                {merchant.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${merchant.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(merchant.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (merchant.amount / merchantList[0].amount) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">No category data available</div>
            ) : (
              <div className="mt-4 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Other']} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Category Breakdown
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pieData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md border">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: CATEGORY_COLORS[category.name] || CATEGORY_COLORS['Other'] }} 
                      />
                      <span>{category.name}</span>
                    </div>
                    <span>${category.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
