'use client'

import { useState } from 'react'
import { useWallet } from '@/components/providers/WalletProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'

interface Token {
  mint: string
  symbol: string
  balance: number
  decimals: number
}

export function TokenTransfer() {
  const { connected, publicKey, signTransaction } = useWallet()
  const [selectedToken, setSelectedToken] = useState<string>('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])

  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  )

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !publicKey) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    try {
      setSending(true)

      // Validate recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipient)
      } catch (error) {
        throw new Error('Invalid recipient address')
      }

      const token = tokens.find(t => t.mint === selectedToken)
      if (!token) {
        throw new Error('Invalid token selected')
      }

      // Convert amount to token units
      const tokenAmount = Math.round(parseFloat(amount) * Math.pow(10, token.decimals))
      if (isNaN(tokenAmount) || tokenAmount <= 0) {
        throw new Error('Invalid amount')
      }

      const mintPubkey = new PublicKey(token.mint)

      // Get source token account
      const sourceTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      )

      // Get destination token account
      const destinationTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        recipientPubkey
      )

      // Check if destination token account exists
      const destinationAccountInfo = await connection.getAccountInfo(destinationTokenAccount)

      // Create transaction
      const transaction = new Transaction()

      // If destination token account doesn't exist, create it
      if (!destinationAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            destinationTokenAccount,
            recipientPubkey,
            mintPubkey
          )
        )
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          sourceTokenAccount,
          destinationTokenAccount,
          publicKey,
          tokenAmount
        )
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTx = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTx.serialize())
      await connection.confirmTransaction(signature)

      toast({
        title: 'Transfer Successful',
        description: `Sent ${amount} ${token.symbol} to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      })

      // Reset form
      setRecipient('')
      setAmount('')
      setSelectedToken('')
    } catch (error: any) {
      toast({
        title: 'Transfer Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  if (!connected || !publicKey) {
    return null
  }

  return (
    <form onSubmit={handleTransfer} className="space-y-4">
      <div>
        <Select
          value={selectedToken}
          onValueChange={setSelectedToken}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Token" />
          </SelectTrigger>
          <SelectContent>
            {tokens.map((token) => (
              <SelectItem key={token.mint} value={token.mint}>
                {token.symbol} ({token.balance})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={sending}
        />
      </div>
      <div>
        <Input
          type="number"
          step="any"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={sending}
        />
      </div>
      <Button
        type="submit"
        disabled={sending || !recipient || !amount || !selectedToken}
      >
        {sending ? 'Sending...' : 'Send Token'}
      </Button>
    </form>
  )
}
