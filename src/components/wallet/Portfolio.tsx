'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/components/providers/WalletProvider'
import { priceService } from '@/lib/price-service'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

interface TokenBalance {
  mint: string
  symbol: string
  balance: number
  value: number
  price: number
  change24h: number
}

interface PortfolioData {
  totalValue: number
  tokens: TokenBalance[]
  change24h: number
}

export function Portfolio() {
  const { connected, publicKey } = useWallet()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    totalValue: 0,
    tokens: [],
    change24h: 0,
  })
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!connected || !publicKey) return

      try {
        setLoading(true)
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
        )

        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey)
        const solPrice = priceService.getPrice('So11111111111111111111111111111111111111112')

        // Fetch token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        )

        const tokens: TokenBalance[] = []
        let totalValue = 0
        let weightedChange = 0

        // Add SOL to portfolio
        if (solPrice) {
          const solValue = (solBalance / 1e9) * solPrice.price
          totalValue += solValue
          weightedChange += solPrice.change24h * solValue

          tokens.push({
            mint: 'So11111111111111111111111111111111111111112',
            symbol: 'SOL',
            balance: solBalance / 1e9,
            value: solValue,
            price: solPrice.price,
            change24h: solPrice.change24h,
          })
        }

        // Process token accounts
        for (const account of tokenAccounts.value) {
          const parsedInfo = account.account.data.parsed.info
          const mintAddress = parsedInfo.mint
          const balance = parsedInfo.tokenAmount.uiAmount

          if (balance > 0) {
            const price = priceService.getPrice(mintAddress)
            const metadata = priceService.getMetadata(mintAddress)

            if (price && metadata) {
              const value = balance * price.price
              totalValue += value
              weightedChange += price.change24h * value

              tokens.push({
                mint: mintAddress,
                symbol: metadata.symbol,
                balance,
                value,
                price: price.price,
                change24h: price.change24h,
              })
            }
          }
        }

        // Calculate portfolio-wide metrics
        const portfolioChange = totalValue > 0 ? weightedChange / totalValue : 0

        setPortfolio({
          totalValue,
          tokens: tokens.sort((a, b) => b.value - a.value),
          change24h: portfolioChange,
        })

        // Fetch historical data for the largest holding
        if (tokens.length > 0) {
          const largestHolding = tokens[0]
          const historicalPrices = await priceService.getHistoricalPrices(largestHolding.mint)
          setHistoricalData(historicalPrices.map(([timestamp, price]: [number, number]) => ({
            timestamp,
            value: price * largestHolding.balance,
          })))
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
    const interval = setInterval(fetchPortfolio, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [connected, publicKey])

  if (!connected || !publicKey) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>
            Total Value: ${portfolio.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span
              className={`ml-2 ${
                portfolio.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {portfolio.change24h >= 0 ? '↑' : '↓'}
              {Math.abs(portfolio.change24h).toFixed(2)}%
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historicalData.length > 0 && (
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) =>
                      new Date(timestamp).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(timestamp) =>
                      new Date(timestamp).toLocaleString()
                    }
                    formatter={(value: number) =>
                      `$${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.tokens.map((token) => (
              <div
                key={token.mint}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-sm text-gray-500">
                      {token.balance.toLocaleString()} tokens
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${token.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p
                    className={`text-sm ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {token.change24h >= 0 ? '↑' : '↓'}
                    {Math.abs(token.change24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
