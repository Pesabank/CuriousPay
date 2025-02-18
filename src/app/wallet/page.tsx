'use client'

import { WalletButton } from '@/components/wallet/WalletButton'
import { WalletBalance } from '@/components/wallet/WalletBalance'
import { TokenList } from '@/components/wallet/TokenList'
import { TokenTransfer } from '@/components/wallet/TokenTransfer'
import { TransactionHistory } from '@/components/wallet/TransactionHistory'
import { TokenSwap } from '@/components/wallet/TokenSwap'
import { Portfolio } from '@/components/wallet/Portfolio'
import { useWallet } from '@/components/providers/WalletProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function WalletPage() {
  const { connected } = useWallet()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-8">
        <WalletButton />
      </div>

      {!connected ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-8">
            Connect your Solana wallet to access your portfolio, swap tokens, and more
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <Portfolio />

          <Tabs defaultValue="swap" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="swap" className="mt-6">
              <TokenSwap />
            </TabsContent>
            
            <TabsContent value="transfer" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <TokenTransfer />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tokens" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Token Balances</CardTitle>
                </CardHeader>
                <CardContent>
                  <TokenList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
