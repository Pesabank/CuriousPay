'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

const TwoFactorSchema = z.object({
  code: z.string().length(6, {
    message: 'Code must be 6 digits',
  }),
})

export default function TwoFactorPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TwoFactorSchema),
  })

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/two-factor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: data.code,
          email: searchParams.get('email'),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      toast({
        title: 'Success',
        description: 'Two-factor authentication verified',
      })

      window.location.href = '/dashboard'
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid code',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Two-factor authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter the code sent to your email to verify your identity.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              {...register('code')}
              className={errors.code ? 'border-red-500' : ''}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">
                {errors.code.message as string}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
