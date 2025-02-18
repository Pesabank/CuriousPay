'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { toast } from '@/components/ui/use-toast'

interface WalletContextType {
  wallet: any | null
  connecting: boolean
  connected: boolean
  publicKey: PublicKey | null
  balance: number | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  sendTransaction: (transaction: Transaction) => Promise<string>
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connecting: false,
  connected: false,
  publicKey: null,
  balance: null,
  connect: async () => {},
  disconnect: async () => {},
  signTransaction: async (transaction: Transaction) => transaction,
  signAllTransactions: async (transactions: Transaction[]) => transactions,
  sendTransaction: async () => '',
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com')

  useEffect(() => {
    const detectWallet = () => {
      const { solana } = window as any
      if (solana?.isPhantom) {
        setWallet(solana)
        if (solana.isConnected) {
          setConnected(true)
          setPublicKey(solana.publicKey)
        }
      }
    }

    if (document.readyState === 'complete') {
      detectWallet()
    } else {
      window.addEventListener('load', detectWallet)
      return () => window.removeEventListener('load', detectWallet)
    }
  }, [])

  useEffect(() => {
    if (!wallet) return

    wallet.on('connect', (publicKey: PublicKey) => {
      setConnected(true)
      setPublicKey(publicKey)
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${publicKey.toString().slice(0, 8)}...`,
      })
    })

    wallet.on('disconnect', () => {
      setConnected(false)
      setPublicKey(null)
      setBalance(null)
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected',
      })
    })

    wallet.on('accountChanged', (publicKey: PublicKey | null) => {
      if (publicKey) {
        setPublicKey(publicKey)
        toast({
          title: 'Account Changed',
          description: `Switched to ${publicKey.toString().slice(0, 8)}...`,
        })
      } else {
        setConnected(false)
        setPublicKey(null)
        setBalance(null)
      }
    })

    return () => {
      wallet.removeAllListeners()
    }
  }, [wallet])

  useEffect(() => {
    const getBalance = async () => {
      if (publicKey && connected) {
        try {
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / 1e9) // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error)
        }
      }
    }

    getBalance()
    const intervalId = setInterval(getBalance, 10000) // Update balance every 10 seconds

    return () => clearInterval(intervalId)
  }, [publicKey, connected, connection])

  const connect = async () => {
    try {
      setConnecting(true)
      if (!wallet) {
        throw new Error('No wallet found! Please install Phantom wallet.')
      }

      await wallet.connect()
    } catch (error: any) {
      toast({
        title: 'Connection Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      if (wallet) {
        await wallet.disconnect()
      }
    } catch (error: any) {
      toast({
        title: 'Disconnection Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const signTransaction = async (transaction: Transaction): Promise<Transaction> => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected')
    }

    try {
      return await wallet.signTransaction(transaction)
    } catch (error: any) {
      toast({
        title: 'Transaction Signing Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }

  const signAllTransactions = async (transactions: Transaction[]): Promise<Transaction[]> => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected')
    }

    try {
      return await wallet.signAllTransactions(transactions)
    } catch (error: any) {
      toast({
        title: 'Transaction Signing Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }

  const sendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected')
    }

    try {
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signed = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature)

      toast({
        title: 'Transaction Sent',
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      })

      return signature
    } catch (error: any) {
      toast({
        title: 'Transaction Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connecting,
        connected,
        publicKey,
        balance,
        connect,
        disconnect,
        signTransaction,
        signAllTransactions,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
