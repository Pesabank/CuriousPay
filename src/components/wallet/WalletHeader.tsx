'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, ExternalLink, ChevronDown, Wallet, ArrowUpDown } from 'lucide-react'

export function WalletHeader() {
  const [showAddress, setShowAddress] = useState(false)
  const [walletAddress] = useState('34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo')
  const [walletBalance] = useState({
    main: 1250.45,
    equivalent: 1250.45,
    currency: 'USD'
  })

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    // Would normally add toast notification here
  }

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <button
            className="flex items-center px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Send / Receive
          </button>
          <button
            className="flex items-center px-4 py-2 text-sm rounded-md bg-secondary text-secondary-foreground"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Current Balance</div>
              <div className="text-3xl font-bold">${walletBalance.main.toLocaleString()}</div>
              <div className="text-sm text-gray-500">≈ ${walletBalance.equivalent.toLocaleString()} {walletBalance.currency}</div>
            </div>
            
            <div className="mt-4 md:mt-0 space-y-2">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <span className="font-medium">{showAddress ? walletAddress : formatAddress(walletAddress)}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={copyAddress}
                  className="flex items-center px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </button>
                <button className="flex items-center px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Explorer
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Total Assets</div>
              <div className="text-lg font-semibold">5</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Total Transactions</div>
              <div className="text-lg font-semibold">147</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Total Sent</div>
              <div className="text-lg font-semibold">$5,430.25</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Total Received</div>
              <div className="text-lg font-semibold">$6,680.70</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 