'use client'

import { useWallet } from '@/components/providers/WalletProvider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function WalletBalance() {
  const { connected, publicKey, balance } = useWallet()

  if (!connected || !publicKey) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>
          Your current SOL balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </p>
            <p className="text-2xl font-bold">
              {balance !== null ? (
                `${balance.toFixed(4)} SOL`
              ) : (
                <Skeleton className="h-6 w-24" />
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
