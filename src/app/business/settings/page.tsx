'use client'

import { useState } from 'react'
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Mail,
  Shield,
  DollarSign,
  AlertTriangle
} from 'lucide-react'
import { useWallet } from '@/components/providers/WalletProvider'

export default function SettingsPage() {
  const { publicKey } = useWallet()
  const [notifications, setNotifications] = useState({
    transactions: true,
    security: true,
    marketing: false,
  })
  const [currency, setCurrency] = useState('USD')

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Account Security */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-xl font-semibold text-white">Account Security</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white mb-2">Connected Wallet</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Wallet Address</p>
              <p className="font-mono text-white break-all">
                {publicKey || 'No wallet connected'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white mb-2">Two-Factor Authentication</h3>
            <button className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Transaction Notifications</p>
              <p className="text-sm text-gray-400">Receive alerts for all transactions</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={notifications.transactions}
                onChange={(e) => setNotifications({...notifications, transactions: e.target.checked})}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Security Alerts</p>
              <p className="text-sm text-gray-400">Get notified about security events</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={notifications.security}
                onChange={(e) => setNotifications({...notifications, security: e.target.checked})}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">Marketing Updates</p>
              <p className="text-sm text-gray-400">Receive news and special offers</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-xl font-semibold text-white">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/20">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-white mb-2">Delete Account</h3>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
