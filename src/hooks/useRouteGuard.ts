'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/components/providers/WalletProvider'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/wallet',
  '/business',
  '/settings',
  '/profile',
]

// Define auth routes
const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
  '/auth/new-password',
  '/auth/verify',
  '/auth/two-factor',
]

// Define public routes
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
]

export function useRouteGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { connected } = useWallet()

  useEffect(() => {
    // Skip for API routes
    if (pathname?.startsWith('/api')) {
      return
    }

    // Handle auth routes
    if (authRoutes.some(route => pathname?.startsWith(route)) && user) {
      router.push('/dashboard')
      return
    }

    // Handle protected routes
    if (protectedRoutes.some(route => pathname?.startsWith(route)) && !user) {
      router.push('/auth/sign-in')
      return
    }

    // Handle wallet routes
    if (pathname?.startsWith('/wallet') && !connected) {
      router.push('/dashboard')
      return
    }

  }, [pathname, user, connected, router])

  return null
}
