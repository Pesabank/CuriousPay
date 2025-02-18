'use client'

import { Wallet } from 'lucide-react'
import { useWallet } from '@/components/providers/WalletProvider'

export function WalletConnect() {
  const { connecting, connected, connect, disconnect } = useWallet()

  return (
    <button
      onClick={connected ? disconnect : connect}
      disabled={connecting}
      className="flex items-center justify-center px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      <Wallet className="h-5 w-5 mr-2" />
      {connecting ? 'Connecting...' : connected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </button>
  )
}
