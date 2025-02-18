'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/components/providers/WalletProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

interface TokenAccount {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  symbol?: string
  name?: string
  logo?: string
}

export function TokenList() {
  const { connected, publicKey } = useWallet()
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState<TokenAccount[]>([])

  useEffect(() => {
    const fetchTokens = async () => {
      if (!connected || !publicKey) return

      try {
        setLoading(true)
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
        )

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        )

        const tokenList = tokenAccounts.value.map((account) => {
          const parsedInfo = account.account.data.parsed.info
          return {
            mint: parsedInfo.mint,
            amount: parsedInfo.tokenAmount.amount,
            decimals: parsedInfo.tokenAmount.decimals,
            uiAmount: parsedInfo.tokenAmount.uiAmount,
          }
        })

        // Filter out tokens with zero balance
        const nonZeroTokens = tokenList.filter((token) => token.uiAmount > 0)
        setTokens(nonZeroTokens)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [connected, publicKey])

  if (!connected || !publicKey) {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        No tokens found in this wallet
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.mint}>
            <TableCell className="font-medium">
              {token.symbol || token.mint.slice(0, 4)}...{token.mint.slice(-4)}
            </TableCell>
            <TableCell className="text-right">
              {token.uiAmount.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
