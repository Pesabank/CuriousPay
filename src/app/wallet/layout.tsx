'use client'

import { WalletHeader } from '@/components/wallet/WalletHeader'
import { useWallet } from '@/components/providers/WalletProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!connected) {
      router.push('/auth/sign-in')
    }
  }, [connected, router])

  return (
    <div className="min-h-screen bg-background">
      <WalletHeader />
      <main className="container mx-auto p-8">{children}</main>
    </div>
  )
}
