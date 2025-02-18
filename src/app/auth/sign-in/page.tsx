'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/components/providers/NotificationProvider'
import Link from 'next/link'

interface LoginForm {
  email: string
  password: string
}

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const notifications = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)

      // Show loading notification
      notifications.addNotification({
        type: 'info',
        title: 'Signing in...',
        message: 'Please wait while we verify your credentials',
        duration: 2000,
      })

      await signIn(data.email, data.password)
      
      // Show success notification
      notifications.addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in',
        duration: 3000,
      })

      // Redirect to business dashboard
      router.push('/business')
      router.refresh() // Force a refresh to update the navigation state
    } catch (error: any) {
      console.error('Sign in error:', error)
      
      // Show error notification
      notifications.addNotification({
        type: 'error',
        title: 'Sign in failed',
        message: error.message || 'Invalid credentials. Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-400">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  disabled={isLoading}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  disabled={isLoading}
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/reset-password"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="mt-2 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2 bg-primary">
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              LipaPay
            </h2>
            <p className="text-lg text-white/90">
              Your trusted decentralized payment platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
