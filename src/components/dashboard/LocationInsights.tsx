'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/hooks/useTransactions'
import { MapPin, ArrowUpRight } from 'lucide-react'

interface LocationData {
  name: string
  transactions: number
  amount: number
}

interface LocationInsightsProps {
  transactions: Transaction[]
}

export function LocationInsights({ transactions }: LocationInsightsProps) {
  const [viewMode, setViewMode] = useState<'cities' | 'countries'>('countries')

  // Extract location data
  const locationMap = transactions.reduce((acc: Record<string, LocationData>, transaction) => {
    // Extract city and country from the location property (assuming it exists)
    if (!transaction.location) return acc
    
    const locationName = viewMode === 'countries' 
      ? transaction.location.country || 'Unknown'
      : `${transaction.location.city || 'Unknown'}, ${transaction.location.country || 'Unknown'}`
    
    if (!acc[locationName]) {
      acc[locationName] = {
        name: locationName,
        transactions: 0,
        amount: 0
      }
    }
    
    acc[locationName].transactions += 1
    acc[locationName].amount += transaction.amount

      return acc
  }, {})

  const locationData = Object.values(locationMap)
    .sort((a, b) => b.amount - a.amount)

  // Calculate totals
  const totalLocations = locationData.length
  const totalAmount = locationData.reduce((sum, loc) => sum + loc.amount, 0)
  const totalTransactions = locationData.reduce((sum, loc) => sum + loc.transactions, 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Location Insights</h2>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'countries'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setViewMode('countries')}
          >
            Countries
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'cities'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setViewMode('cities')}
          >
            Cities
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total {viewMode === 'countries' ? 'Countries' : 'Cities'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average per {viewMode === 'countries' ? 'Country' : 'City'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalAmount / Math.max(1, totalLocations)).toFixed(2)}
          </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions per {viewMode === 'countries' ? 'Country' : 'City'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalTransactions / Math.max(1, totalLocations)).toFixed(1)}
          </div>
          </CardContent>
        </Card>
        </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>
            Top {viewMode === 'countries' ? 'Countries' : 'Cities'} by Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationData.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No location data available</div>
          ) : (
            <div className="space-y-6">
              {locationData.slice(0, 5).map((location, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center mb-2">
                    <div className="mr-4">
                      <MapPin className="h-5 w-5 text-primary" />
          </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{location.name}</h3>
                        <div className="flex items-center">
                          <span className="font-medium">${location.amount.toFixed(2)}</span>
                          <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
        </div>
      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{location.transactions} transactions</span>
                        <span>{((location.amount / totalAmount) * 100).toFixed(1)}%</span>
                      </div>
          </div>
        </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (location.amount / locationData[0].amount) * 100)}%` 
                      }}
                    />
        </div>
      </div>
              ))}
        </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
