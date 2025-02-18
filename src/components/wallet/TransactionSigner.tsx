'use client'

import { useState } from 'react'
import { useWallet } from '@/components/providers/WalletProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

export function TransactionSigner() {
  const { connected, publicKey, sendTransaction } = useWallet()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)

  const handleSendTransaction = async (e: React.FormEvent) => {
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

      // Validate amount
      const lamports = parseFloat(amount) * 1e9 // Convert SOL to lamports
      if (isNaN(lamports) || lamports <= 0) {
        throw new Error('Invalid amount')
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: Math.round(lamports),
        })
      )

      // Send transaction
      const signature = await sendTransaction(transaction)

      toast({
        title: 'Transaction Successful',
        description: `Sent ${amount} SOL to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      })

      // Reset form
      setRecipient('')
      setAmount('')
    } catch (error: any) {
      toast({
        title: 'Transaction Failed',
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
    <form onSubmit={handleSendTransaction} className="space-y-4">
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
          step="0.000000001"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={sending}
        />
      </div>
      <Button type="submit" disabled={sending || !recipient || !amount}>
        {sending ? 'Sending...' : 'Send SOL'}
      </Button>
    </form>
  )
}
