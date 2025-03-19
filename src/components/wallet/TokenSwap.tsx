'use client'

import { useState } from 'react'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowDownUp } from 'lucide-react'

interface Token {
  address: string
  symbol: string
  decimals: number
  logoURI?: string
}

export function TokenSwap() {
  const { connected } = useWallet()
  const [tokens] = useState<Token[]>([
    {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      decimals: 9,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    },
    {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      symbol: 'USDC',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    },
    {
      address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      symbol: 'USDT',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
    }
  ])
  const [inputToken, setInputToken] = useState<string>('')
  const [outputToken, setOutputToken] = useState<string>('')
  const [inputAmount, setInputAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [loading, setLoading] = useState(false)

  const handleSwap = async () => {
    setLoading(true)
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would be where you call your swap logic
      console.log('Swapping tokens', {
        inputToken,
        outputToken,
        inputAmount,
        slippage
      })
      
      // Reset form
      setInputAmount('')
    } catch (error) {
      console.error('Swap error:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchTokens = () => {
    const temp = inputToken
    setInputToken(outputToken)
    setOutputToken(temp)
    setInputAmount('')
  }

  const calculateEstimatedOutput = () => {
    if (!inputToken || !outputToken || !inputAmount) return '0'
    
    // Mock exchange rates for demo - in a real app this would use actual rates
    const rates = {
      'SOL_USDC': 100, // 1 SOL = 100 USDC
      'USDC_SOL': 0.01, // 1 USDC = 0.01 SOL
      'SOL_USDT': 100, // 1 SOL = 100 USDT
      'USDT_SOL': 0.01, // 1 USDT = 0.01 SOL
      'USDC_USDT': 1, // 1 USDC = 1 USDT
      'USDT_USDC': 1 // 1 USDT = 1 USDC
    }

    const inputSymbol = tokens.find(t => t.address === inputToken)?.symbol || ''
    const outputSymbol = tokens.find(t => t.address === outputToken)?.symbol || ''
    const rateKey = `${inputSymbol}_${outputSymbol}` as keyof typeof rates
    
    if (!rates[rateKey]) return '0'
    
    const amount = parseFloat(inputAmount) * rates[rateKey]
    return amount.toFixed(6)
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
          <CardDescription>Connect your wallet to swap tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <p className="text-gray-500">Please connect your wallet to use the swap feature</p>
        </CardContent>
      </Card>
    )
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
                onChange={(e) => setInputAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={switchTokens}
              className="rounded-full bg-slate-800"
            >
              <ArrowDownUp className="h-4 w-4" />
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
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Estimated output"
                value={calculateEstimatedOutput()}
                readOnly
              />
            </div>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSwap}
          disabled={!inputToken || !outputToken || !inputAmount || inputAmount === '0' || loading}
        >
          {loading ? 'Processing...' : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  )
}
