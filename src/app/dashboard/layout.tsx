'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { useWallet } from '@/components/providers/WalletProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
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
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
