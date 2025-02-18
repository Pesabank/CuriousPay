import { PublicKey } from '@solana/web3.js'

interface TokenPrice {
  price: number
  change24h: number
  volume24h: number
}

interface TokenMetadata {
  symbol: string
  name: string
  image: string
  coingeckoId?: string
}

class PriceService {
  private static instance: PriceService
  private prices: Map<string, TokenPrice> = new Map()
  private metadata: Map<string, TokenMetadata> = new Map()
  private subscribers: Set<(prices: Map<string, TokenPrice>) => void> = new Set()

  private constructor() {
    this.startPriceUpdates()
  }

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService()
    }
    return PriceService.instance
  }

  private async fetchPrices() {
    try {
      // Fetch prices from Jupiter API
      const response = await fetch('https://price.jup.ag/v4/price')
      const data = await response.json()

      // Update prices
      Object.entries(data.data).forEach(([mint, priceData]: [string, any]) => {
        this.prices.set(mint, {
          price: priceData.price,
          change24h: priceData.change24h || 0,
          volume24h: priceData.volume24h || 0,
        })
      })

      // Notify subscribers
      this.notifySubscribers()
    } catch (error) {
      console.error('Error fetching prices:', error)
    }
  }

  private async fetchTokenMetadata() {
    try {
      // Fetch token list from Jupiter
      const response = await fetch('https://token.jup.ag/strict')
      const data = await response.json()

      // Update metadata
      data.forEach((token: any) => {
        this.metadata.set(token.address, {
          symbol: token.symbol,
          name: token.name,
          image: token.logoURI,
          coingeckoId: token.extensions?.coingeckoId,
        })
      })
    } catch (error) {
      console.error('Error fetching token metadata:', error)
    }
  }

  private startPriceUpdates() {
    // Fetch initial data
    this.fetchTokenMetadata()
    this.fetchPrices()

    // Update prices every 10 seconds
    setInterval(() => this.fetchPrices(), 10000)
    // Update metadata every hour
    setInterval(() => this.fetchTokenMetadata(), 3600000)
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.prices))
  }

  subscribe(callback: (prices: Map<string, TokenPrice>) => void) {
    this.subscribers.add(callback)
    // Immediately call with current prices
    callback(this.prices)
    return () => this.subscribers.delete(callback)
  }

  getPrice(mintAddress: string | PublicKey): TokenPrice | null {
    const address = mintAddress.toString()
    return this.prices.get(address) || null
  }

  getMetadata(mintAddress: string | PublicKey): TokenMetadata | null {
    const address = mintAddress.toString()
    return this.metadata.get(address) || null
  }

  getTokenValue(mintAddress: string | PublicKey, amount: number): number {
    const price = this.getPrice(mintAddress)
    return price ? price.price * amount : 0
  }

  async getHistoricalPrices(mintAddress: string | PublicKey, days: number = 7): Promise<any[]> {
    const metadata = this.getMetadata(mintAddress)
    if (!metadata?.coingeckoId) return []

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${metadata.coingeckoId}/market_chart?vs_currency=usd&days=${days}`
      )
      const data = await response.json()
      return data.prices
    } catch (error) {
      console.error('Error fetching historical prices:', error)
      return []
    }
  }
}

export const priceService = PriceService.getInstance()
