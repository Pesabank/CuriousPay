import { useState, useEffect } from 'react'

// Mock transaction types
export interface Transaction {
  id: string
  type: 'payment' | 'swap' | 'deposit' | 'withdrawal'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  description?: string
  merchant?: string
  location?: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate API fetch with a timeout
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        // Mock API response delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // Mock transaction data
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            type: 'payment',
            amount: 250,
            currency: 'USDC',
            status: 'completed',
            date: '2023-03-15T14:30:00Z',
            merchant: 'Coffee Shop',
            location: 'Nairobi, Kenya'
          },
          {
            id: '2',
            type: 'swap',
            amount: 100,
            currency: 'SOL',
            status: 'completed',
            date: '2023-03-14T09:15:00Z',
            description: 'Swap SOL to USDC'
          },
          {
            id: '3',
            type: 'deposit',
            amount: 500,
            currency: 'USDC',
            status: 'completed',
            date: '2023-03-10T18:45:00Z',
            description: 'Deposit from bank account'
          },
          {
            id: '4',
            type: 'payment',
            amount: 75,
            currency: 'USDC',
            status: 'pending',
            date: '2023-03-08T12:30:00Z',
            merchant: 'Online Store',
            location: 'Mombasa, Kenya'
          },
          {
            id: '5',
            type: 'withdrawal',
            amount: 300,
            currency: 'USDC',
            status: 'completed',
            date: '2023-03-05T16:20:00Z',
            description: 'Withdrawal to bank account'
          }
        ]
        
        setTransactions(mockTransactions)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return { transactions, isLoading, error }
} 