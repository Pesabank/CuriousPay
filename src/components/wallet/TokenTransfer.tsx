'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/components/providers/WalletProvider'

interface Token {
  symbol: string
  name: string
  balance: number
}

export function TokenTransfer() {
  const { connected } = useWallet()
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [selectedToken, setSelectedToken] = useState('SOL')
  
  const mockTokens: Token[] = [
    { symbol: 'SOL', name: 'Solana', balance: 12.45 },
    { symbol: 'USDC', name: 'USD Coin', balance: 350.75 },
    { symbol: 'BTC', name: 'Bitcoin (Wrapped)', balance: 0.025 }
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here would be token transfer logic
    console.log('Transferring', amount, selectedToken, 'to', recipient)
    // Reset form
    setAmount('')
    setRecipient('')
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-center text-sm text-gray-500 mb-4">
              Connect your wallet to send tokens
            </p>
            <Button variant="outline">Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Token
            </label>
            <div className="relative">
              <select
                id="token"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm appearance-none"
              >
                {mockTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name} ({token.balance})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="recipient" className="text-sm font-medium">
              Recipient Address
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full rounded-md border border-slate-300 bg-white pl-3 pr-12 py-2 text-sm"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">{selectedToken}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Fee: ~0.000005 SOL</span>
              <button 
                type="button" 
                className="text-primary"
                onClick={() => {
                  const token = mockTokens.find(t => t.symbol === selectedToken)
                  if (token) setAmount(token.balance.toString())
                }}
              >
                MAX
              </button>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Send {selectedToken}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
