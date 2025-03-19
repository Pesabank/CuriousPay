'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, Banknote, CreditCard, Users, Wallet } from 'lucide-react'

export function DashboardOverview() {
  const [stats] = useState([
    { 
      title: 'Total Balance',
      value: '$2,546.89',
      change: '+12.5%',
      icon: Wallet,
    },
    { 
      title: 'Weekly Revenue',
      value: '$1,245.80',
      change: '+5.2%',
      icon: Banknote,
    },
    { 
      title: 'Active Users',
      value: '2,450',
      change: '+18.7%',
      icon: Users,
    },
    { 
      title: 'Transactions',
      value: '1,280',
      change: '+4.3%',
      icon: CreditCard,
    },
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm text-green-500">
                {stat.change}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Payment to Merchant #{i}</div>
                    <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
                  </div>
                  <div className="font-medium text-red-500">-$89.{i}0</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-40">
              <div className="text-5xl font-bold">2,450</div>
              <div className="text-sm text-gray-500">Users this month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 