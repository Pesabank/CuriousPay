'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Bell, 
  Lock, 
  User, 
  Settings, 
  CreditCard, 
  ChevronRight 
} from 'lucide-react'

interface SettingsNavItem {
  title: string
  href: string
  icon: React.ElementType
  description: string
}

export function SettingsSidebar() {
  const pathname = usePathname()
  
  const navItems: SettingsNavItem[] = [
    {
      title: 'Profile',
      href: '/settings/profile',
      icon: User,
      description: 'Manage your personal information'
    },
    {
      title: 'Security',
      href: '/settings/security',
      icon: Lock,
      description: 'Secure your account and authentication settings'
    },
    {
      title: 'Notifications',
      href: '/settings/notifications',
      icon: Bell,
      description: 'Configure how you receive alerts and messages'
    },
    {
      title: 'Payment Methods',
      href: '/settings/payment-methods',
      icon: CreditCard,
      description: 'Manage your linked payment accounts'
    },
    {
      title: 'Preferences',
      href: '/settings/preferences',
      icon: Settings,
      description: 'Customize your experience'
    }
  ]
  
  return (
    <div className="w-full md:w-72 md:min-w-72">
      <div className="space-y-1">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                      {item.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 