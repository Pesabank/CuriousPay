'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          throw new Error('Missing token')
        }

        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message)
        }

        toast({
          title: 'Success',
          description: 'Email verified successfully',
        })

        window.location.href = '/auth/sign-in'
      } catch (error: any) {
        setError(error.message)
        toast({
          title: 'Error',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Verify your email
        </h2>
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}
        {!isLoading && !error && (
          <div className="text-green-500">
            Email verified successfully! Redirecting...
          </div>
        )}
      </div>
    </div>
  )
}
