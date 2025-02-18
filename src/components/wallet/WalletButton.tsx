'use client'

import { useWallet } from '@/components/providers/WalletProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Loader2 } from 'lucide-react'

export function WalletButton() {
  const { connected, connecting, publicKey, balance, connect, disconnect } = useWallet()

  if (connecting) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {balance !== null && `${balance.toFixed(2)} SOL • `}
            {`${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => disconnect()}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={() => connect()}>
      Connect Wallet
    </Button>
  )
}
