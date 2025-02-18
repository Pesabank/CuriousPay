'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/components/providers/WalletProvider'

// Define protected routes that require both auth and wallet
const protectedWalletRoutes = [
  '/wallet',
  '/settings/wallet',
]

// Define routes that only require authentication
const protectedAuthRoutes = [
  '/business',
  '/dashboard',
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
  '/how-it-works',
]

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const { connected, connecting: walletLoading } = useWallet()

  useEffect(() => {
    // Don't redirect while loading
    if (authLoading) {
      return
    }

    // Skip for API routes
    if (pathname?.startsWith('/api')) {
      return
    }

    const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))
    const isProtectedWalletRoute = protectedWalletRoutes.some(route => pathname?.startsWith(route))
    const isProtectedAuthRoute = protectedAuthRoutes.some(route => pathname?.startsWith(route))

    // Don't redirect if on public routes
    if (isPublicRoute) {
      return
    }

    // If user is not authenticated and tries to access protected routes, redirect to sign in
    if (!user && (isProtectedWalletRoute || isProtectedAuthRoute)) {
      router.replace('/auth/sign-in')
      return
    }

    // If user is authenticated and tries to access auth routes, redirect to business
    if (user && isAuthRoute) {
      router.replace('/business')
      return
    }

    // For wallet-specific routes, check wallet connection
    if (isProtectedWalletRoute) {
      if (walletLoading) {
        return // Don't redirect while wallet is connecting
      }

      if (!connected) {
        router.replace('/wallet/connect')
        return
      }
    }
  }, [user, connected, pathname, authLoading, walletLoading, router])

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FF84]"></div>
      </div>
    )
  }

  return <>{children}</>
}
