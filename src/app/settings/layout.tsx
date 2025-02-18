'use client'

import { SettingsSidebar } from '@/components/settings/SettingsSidebar'
import { Header } from '@/components/dashboard/Header'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SettingsSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
