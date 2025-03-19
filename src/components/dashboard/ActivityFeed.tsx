'use client'

import { useState } from 'react'

export function ActivityFeed() {
  const [activities] = useState([
    {
      id: '1',
      type: 'transaction',
      title: 'Payment Received',
      amount: '0.5 SOL',
      timestamp: '2023-03-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Token Swap',
      amount: '10 USDC → 0.25 SOL',
      timestamp: '2023-03-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'system',
      title: 'Account Verified',
      timestamp: '2023-03-12T09:15:00Z',
      status: 'completed'
    }
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Activity Feed</h1>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-white">{activity.title}</h3>
              {activity.amount && <p className="text-gray-400">{activity.amount}</p>}
              <p className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activity.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 