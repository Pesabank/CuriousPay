'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/hooks/useTransactions'

interface MerchantData {
  name: string
  transactions: number
  amount: number
  date: string
}

interface MerchantAnalyticsProps {
  transactions: Transaction[]
}

export function MerchantAnalytics({ transactions }: MerchantAnalyticsProps) {
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
          date: transaction.date
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
                merchantList.reduce((sum, m) => sum + m.transactions, 0)).toFixed(2)}
          </div>
          </CardContent>
        </Card>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Merchants by Volume</CardTitle>
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
                        <p className="text-sm text-gray-500">{merchant.transactions} transactions</p>
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
    </div>
  )
}
