'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface NotificationSetting {
  id: string
  title: string
  description: string
  email: boolean
  push: boolean
  sms: boolean
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'security',
      title: 'Security Alerts',
      description: 'Get notified about important security-related events such as password changes, new device logins, etc.',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'transactions',
      title: 'Transaction Updates',
      description: 'Receive notifications about payments, deposits, and other account activities.',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'marketing',
      title: 'Marketing & Promotions',
      description: 'Stay updated on new features, special offers, and other promotional content.',
      email: false,
      push: false,
      sms: false
    },
    {
      id: 'system',
      title: 'System Updates',
      description: 'Get notified about platform maintenance, outages, and important announcements.',
      email: true,
      push: false,
      sms: false
    }
  ])

  const toggleSetting = (id: string, channel: 'email' | 'push' | 'sms') => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, [channel]: !setting[channel] } 
          : setting
      )
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notification Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Control how you receive notifications and updates from CuriousPay
        </p>
      </div>

      <div className="space-y-6">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <CardTitle>{setting.title}</CardTitle>
              <CardDescription>{setting.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${setting.id}-email`}
                    checked={setting.email}
                    onChange={() => toggleSetting(setting.id, 'email')}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label 
                    htmlFor={`${setting.id}-email`}
                    className="text-sm font-medium"
                  >
                    Email
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${setting.id}-push`}
                    checked={setting.push}
                    onChange={() => toggleSetting(setting.id, 'push')}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label 
                    htmlFor={`${setting.id}-push`}
                    className="text-sm font-medium"
                  >
                    Push
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${setting.id}-sms`}
                    checked={setting.sms}
                    onChange={() => toggleSetting(setting.id, 'sms')}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label 
                    htmlFor={`${setting.id}-sms`}
                    className="text-sm font-medium"
                  >
                    SMS
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 