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
import { Button } from '@/components/ui/button'
import { Connection, ParsedTransactionWithMeta } from '@solana/web3.js'
import { formatDistance } from 'date-fns'

interface ParsedTransaction {
  signature: string
  timestamp: number
  status: 'success' | 'error'
  type: string
  amount?: number
  token?: string
  from: string
  to: string
}

export function TransactionHistory() {
  const { connected, publicKey } = useWallet()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  )

  const parseTransaction = async (tx: ParsedTransactionWithMeta): Promise<ParsedTransaction | null> => {
    if (!tx.meta || !tx.transaction.message.accountKeys || !publicKey) return null

    try {
      const timestamp = (await connection.getBlockTime(tx.slot)) || 0
      const signature = tx.transaction.signatures[0]
      const status = tx.meta.err ? 'error' : 'success'

      // Try to parse transfer details
      let type = 'unknown'
      let amount: number | undefined
      let token: string | undefined
      let from = ''
      let to = ''

      // Check if it's a SOL transfer
      const instructions = tx.transaction.message.instructions
      if (instructions.length > 0) {
        const instruction = instructions[0]
        if ('program' in instruction && instruction.program === 'system') {
          if ('parsed' in instruction && instruction.parsed.type === 'transfer') {
            type = 'SOL Transfer'
            amount = instruction.parsed.info.lamports / 1e9
            from = instruction.parsed.info.source
            to = instruction.parsed.info.destination
          }
        }
        // Check if it's a token transfer
        else if ('programId' in instruction && instruction.programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
          type = 'Token Transfer'
          // Parse token transfer details...
          // This is simplified - you'd need to decode the instruction data
        }
      }

      return {
        signature,
        timestamp,
        status,
        type,
        amount,
        token,
        from,
        to,
      }
    } catch (error) {
      console.error('Error parsing transaction:', error)
      return null
    }
  }

  const fetchTransactions = async (before?: string) => {
    if (!connected || !publicKey) return

    try {
      setLoadingMore(true)
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { before, limit: 10 },
        'confirmed'
      )

      if (signatures.length < 10) {
        setHasMore(false)
      }

      const txs = await connection.getParsedTransactions(
        signatures.map(sig => sig.signature)
      )

      const parsedTxs = await Promise.all(
        txs.map(tx => tx && parseTransaction(tx))
      )

      const validTxs = parsedTxs.filter((tx): tx is ParsedTransaction => tx !== null)

      setTransactions(prev => [...prev, ...validTxs])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setTransactions([])
    setHasMore(true)
    setLoading(true)
    fetchTransactions()
  }, [connected, publicKey])

  if (!connected || !publicKey) {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        No transactions found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.signature}>
              <TableCell>{tx.type}</TableCell>
              <TableCell>
                {tx.amount && (
                  <span>
                    {tx.amount} {tx.token || 'SOL'}
                  </span>
                )}
              </TableCell>
              <TableCell className="font-mono">
                {tx.from.slice(0, 4)}...{tx.from.slice(-4)}
              </TableCell>
              <TableCell className="font-mono">
                {tx.to.slice(0, 4)}...{tx.to.slice(-4)}
              </TableCell>
              <TableCell>
                {formatDistance(tx.timestamp * 1000, new Date(), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tx.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => fetchTransactions(transactions[transactions.length - 1].signature)}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
