'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/components/providers/WalletProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Connection, PublicKey } from '@solana/web3.js'
import { Jupiter } from '@jup-ag/core'
import { JSBI } from '@jup-ag/math'
import { ArrowsUpDownIcon } from 'lucide-react'
import { priceService } from '@/lib/price-service'

interface Token {
  address: string
  symbol: string
  decimals: number
  logoURI?: string
}

interface Route {
  inAmount: string
  outAmount: string
  priceImpactPct: number
  marketInfos: any[]
  slippageBps: number
  fees: {
    totalFees: number
    platformFees: number
  }
}

export function TokenSwap() {
  const { connected, publicKey, signTransaction } = useWallet()
  const [tokens, setTokens] = useState<Token[]>([])
  const [inputToken, setInputToken] = useState<string>('')
  const [outputToken, setOutputToken] = useState<string>('')
  const [inputAmount, setInputAmount] = useState('')
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [slippage, setSlippage] = useState(0.5) // 0.5% default slippage
  const [routeOptimization, setRouteOptimization] = useState<'best' | 'fast'>('best')

  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  )

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://token.jup.ag/strict')
        const data = await response.json()
        setTokens(data)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      }
    }

    fetchTokens()
  }, [])

  const findRoutes = async () => {
    if (!inputToken || !outputToken || !inputAmount || !publicKey) return

    try {
      setLoading(true)

      const jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: publicKey,
      })

      const amountInBN = JSBI.BigInt(
        Math.round(
          parseFloat(inputAmount) *
            Math.pow(10, tokens.find(t => t.address === inputToken)?.decimals || 0)
        )
      )

      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(inputToken),
        outputMint: new PublicKey(outputToken),
        amount: amountInBN,
        slippageBps: Math.round(slippage * 100),
        onlyDirectRoutes: routeOptimization === 'fast',
        filterTopNResult: routeOptimization === 'best' ? 3 : 1,
      })

      setRoutes(routes.routesInfos)
      if (routes.routesInfos.length > 0) {
        // Select the route with best output amount
        const bestRoute = routes.routesInfos.reduce((best, current) => {
          return parseFloat(current.outAmount) > parseFloat(best.outAmount) ? current : best
        }, routes.routesInfos[0])
        setSelectedRoute(bestRoute)
      }
    } catch (error) {
      console.error('Error finding routes:', error)
      toast({
        title: 'Error',
        description: 'Failed to find swap routes',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const executeSwap = async () => {
    if (!selectedRoute || !publicKey) return

    try {
      setSwapping(true)

      const jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: publicKey,
      })

      const { transactions } = await jupiter.exchange({
        routeInfo: selectedRoute,
      })

      // Sign and send the transaction
      const signedTx = await signTransaction(transactions.swapTransaction)
      const signature = await connection.sendRawTransaction(signedTx.serialize())
      
      // Wait for confirmation with a timeout
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
        ),
      ])

      toast({
        title: 'Swap Successful',
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      })

      // Reset form
      setInputAmount('')
      setSelectedRoute(null)
      setRoutes([])
    } catch (error: any) {
      toast({
        title: 'Swap Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSwapping(false)
    }
  }

  const switchTokens = () => {
    const temp = inputToken
    setInputToken(outputToken)
    setOutputToken(temp)
    setInputAmount('')
    setSelectedRoute(null)
    setRoutes([])
  }

  const getTokenPrice = (tokenAddress: string) => {
    const price = priceService.getPrice(tokenAddress)
    return price?.price || 0
  }

  const calculateUSDValue = (amount: string, tokenAddress: string) => {
    const price = getTokenPrice(tokenAddress)
    return parseFloat(amount) * price
  }

  if (!connected || !publicKey) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>
          Swap tokens at the best available rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Select value={inputToken} onValueChange={setInputToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select input token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center">
                      {token.logoURI && (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-5 h-5 mr-2"
                        />
                      )}
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2">
              <Input
                type="number"
                placeholder="Amount"
                value={inputAmount}
                onChange={(e) => {
                  setInputAmount(e.target.value)
                  setSelectedRoute(null)
                  setRoutes([])
                }}
              />
              {inputToken && inputAmount && (
                <p className="text-sm text-gray-500 mt-1">
                  ≈ ${calculateUSDValue(inputAmount, inputToken).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={switchTokens}
              className="rounded-full"
            >
              <ArrowsUpDownIcon className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Select value={outputToken} onValueChange={setOutputToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select output token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center">
                      {token.logoURI && (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-5 h-5 mr-2"
                        />
                      )}
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slippage Tolerance</label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[slippage]}
                onValueChange={([value]) => setSlippage(value)}
                min={0.1}
                max={5}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm">{slippage}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Route Optimization</label>
            <div className="flex space-x-2">
              <Button
                variant={routeOptimization === 'best' ? 'default' : 'outline'}
                onClick={() => setRouteOptimization('best')}
                className="flex-1"
              >
                Best Price
              </Button>
              <Button
                variant={routeOptimization === 'fast' ? 'default' : 'outline'}
                onClick={() => setRouteOptimization('fast')}
                className="flex-1"
              >
                Fast Swap
              </Button>
            </div>
          </div>

          <Button
            onClick={findRoutes}
            disabled={!inputToken || !outputToken || !inputAmount || loading}
            className="w-full"
          >
            {loading ? 'Finding best routes...' : 'Find Routes'}
          </Button>
        </div>

        {selectedRoute && (
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>You Pay</span>
                <span>
                  {inputAmount} {tokens.find(t => t.address === inputToken)?.symbol}
                  <span className="text-gray-500 ml-1">
                    (${calculateUSDValue(inputAmount, inputToken).toFixed(2)})
                  </span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>You Receive</span>
                <span>
                  {(parseFloat(selectedRoute.outAmount) / Math.pow(10, tokens.find(t => t.address === outputToken)?.decimals || 0)).toFixed(6)}{' '}
                  {tokens.find(t => t.address === outputToken)?.symbol}
                  <span className="text-gray-500 ml-1">
                    (${calculateUSDValue(
                      (parseFloat(selectedRoute.outAmount) / Math.pow(10, tokens.find(t => t.address === outputToken)?.decimals || 0)).toString(),
                      outputToken
                    ).toFixed(2)})
                  </span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate</span>
                <span>
                  1 {tokens.find(t => t.address === inputToken)?.symbol} ≈{' '}
                  {(
                    parseFloat(selectedRoute.outAmount) /
                    parseFloat(selectedRoute.inAmount)
                  ).toFixed(6)}{' '}
                  {tokens.find(t => t.address === outputToken)?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price Impact</span>
                <span
                  className={
                    selectedRoute.priceImpactPct > 1
                      ? 'text-red-500'
                      : 'text-green-500'
                  }
                >
                  {selectedRoute.priceImpactPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee</span>
                <span>{(selectedRoute.fees?.totalFees || 0).toFixed(6)} SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Route</span>
                <span>
                  {selectedRoute.marketInfos.map((market, i) => (
                    <span key={i}>
                      {i > 0 && ' → '}
                      {market.label}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <Button
              onClick={executeSwap}
              disabled={swapping}
              className="w-full"
              variant="default"
            >
              {swapping ? 'Swapping...' : 'Swap Tokens'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
