'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MerchantAnalytics } from '@/components/dashboard/MerchantAnalytics'
import { LocationInsights } from '@/components/dashboard/LocationInsights'
import { useTransactions } from '@/hooks/useTransactions'

export default function AnalyticsPage() {
  const { transactions, isLoading, error } = useTransactions()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading transactions: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Analytics Dashboard</h1>
      
      <Tabs defaultValue="merchants" className="space-y-6">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="merchants">Merchant Analytics</TabsTrigger>
          <TabsTrigger value="locations">Location Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="merchants">
          <MerchantAnalytics transactions={transactions} />
        </TabsContent>

        <TabsContent value="locations">
          <LocationInsights transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
