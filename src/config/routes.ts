export const routes = {
  // Public routes
  public: {
    home: '/',
    about: '/about',
    contact: '/contact',
    terms: '/terms',
    privacy: '/privacy',
  },

  // Authentication routes
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
    newPassword: '/auth/new-password',
    verify: '/auth/verify',
    twoFactor: '/auth/two-factor',
  },

  // Dashboard routes
  dashboard: {
    root: '/dashboard',
    overview: '/dashboard/overview',
    activity: '/dashboard/activity',
    notifications: '/dashboard/notifications',
  },

  // Wallet routes
  wallet: {
    root: '/wallet',
    portfolio: '/wallet/portfolio',
    swap: '/wallet/swap',
    transfer: '/wallet/transfer',
    history: '/wallet/history',
    tokens: '/wallet/tokens',
  },

  // Business routes
  business: {
    root: '/business',
    overview: '/business/overview',
    analytics: '/business/analytics',
    wallets: '/business/wallets',
    virtualCards: '/business/virtual-cards',
    settings: '/business/settings',
    security: '/business/security',
  },

  // Profile & Settings routes
  settings: {
    root: '/settings',
    profile: '/settings/profile',
    security: '/settings/security',
    preferences: '/settings/preferences',
    notifications: '/settings/notifications',
  },

  // API routes
  api: {
    auth: {
      signIn: '/api/auth/sign-in',
      signUp: '/api/auth/sign-up',
      verify: '/api/auth/verify',
      resetPassword: '/api/auth/reset-password',
      twoFactor: '/api/auth/two-factor',
    },
    wallet: {
      balance: '/api/wallet/balance',
      tokens: '/api/wallet/tokens',
      transactions: '/api/wallet/transactions',
      transfer: '/api/wallet/transfer',
    },
    business: {
      overview: '/api/business/overview',
      analytics: '/api/business/analytics',
      transactions: '/api/business/transactions',
    },
  },
} as const

// Helper function to get route path
export function getRoute(path: string): string {
  return path.split('.').reduce((obj: any, key: string) => obj[key], routes)
}

// Helper function to check if route is protected
export function isProtectedRoute(path: string): boolean {
  const protectedPrefixes = ['/dashboard', '/wallet', '/business', '/settings']
  return protectedPrefixes.some(prefix => path.startsWith(prefix))
}

// Helper function to check if route is public
export function isPublicRoute(path: string): boolean {
  const publicPaths = Object.values(routes.public)
  return publicPaths.includes(path as any)
}

// Helper function to check if route is auth route
export function isAuthRoute(path: string): boolean {
  const authPaths = Object.values(routes.auth)
  return authPaths.includes(path as any)
}
