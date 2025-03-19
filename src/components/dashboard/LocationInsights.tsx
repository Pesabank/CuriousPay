'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/hooks/useTransactions'
import { MapPin, ArrowUpRight, Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LocationData {
  name: string
  transactions: number
  amount: number
}

interface Location {
  city?: string
  country?: string
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
    
    // Make sure location is handled as an object with city/country properties
    const location = typeof transaction.location === 'string' 
      ? { country: transaction.location }
      : transaction.location as Location
    
    const locationName = viewMode === 'countries' 
      ? location.country || 'Unknown'
      : `${location.city || 'Unknown'}, ${location.country || 'Unknown'}`
    
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

  // Generate simplified heatmap data for visualization
  const getHeatmapData = () => {
    // This would ideally be connected to a real map visualization library
    // But for now, we'll create a simple representation
    return locationData.slice(0, 10).map(location => ({
      id: location.name.replace(/\s+/g, '-').toLowerCase(),
      name: location.name,
      value: location.amount,
      radius: Math.sqrt(location.transactions) * 5,
      fillColor: `hsl(${Math.floor(200 + (location.amount / totalAmount) * 100)}, 70%, 50%)`,
    }))
  }

  const heatmapData = getHeatmapData()

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

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Heat Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
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
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Transaction Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              {locationData.length === 0 ? (
                <div className="text-center text-sm text-gray-500">No location data available</div>
              ) : (
                <div>
                  <div className="relative aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    {/* Simple heatmap visualization */}
                    <div className="absolute inset-0 opacity-30 bg-[url('/world-map-outline.svg')] bg-no-repeat bg-center bg-contain"></div>
                    
                    {/* Simplified heatmap representation */}
                    <div className="absolute inset-0">
                      {heatmapData.map((location, index) => (
                        <div
                          key={location.id}
                          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                          style={{
                            width: `${location.radius}px`,
                            height: `${location.radius}px`,
                            backgroundColor: location.fillColor,
                            // Random positioning for demonstration only
                            left: `${20 + (index * 60) % 80}%`,
                            top: `${30 + ((index * 40) % 50)}%`,
                            opacity: 0.7,
                            boxShadow: `0 0 ${location.radius * 2}px ${location.fillColor}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {heatmapData.slice(0, 6).map(location => (
                      <div key={location.id} className="flex items-center p-2 border rounded">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: location.fillColor }} 
                        />
                        <span className="text-sm truncate">{location.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
