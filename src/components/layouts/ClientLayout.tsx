'use client'

import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { WalletProvider } from '@/components/providers/WalletProvider'
import { NotificationProvider } from '@/components/providers/NotificationProvider'
import { ProtectedRoute } from '@/components/layouts/ProtectedRoute'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <NotificationProvider>
          <ProtectedRoute>
            <main className="min-h-screen bg-black text-white">
              {children}
            </main>
            <Toaster />
          </ProtectedRoute>
        </NotificationProvider>
      </WalletProvider>
    </AuthProvider>
  )
}
