import Link from 'next/link'
import { 
  Home, 
  Wallet, 
  BarChart2, 
  QrCode,
  CreditCard,
  Settings,
  HelpCircle
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/business', icon: Home },
  { name: 'Wallets', href: '/business/wallets', icon: Wallet },
  { name: 'Analytics', href: '/business/analytics', icon: BarChart2 },
  { name: 'QR Codes', href: '/business/qr-codes', icon: QrCode },
  { name: 'Virtual Cards', href: '/business/virtual-cards', icon: CreditCard },
  { name: 'Settings', href: '/business/settings', icon: Settings },
  { name: 'Help', href: '/business/help', icon: HelpCircle },
]

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/business" className="text-2xl font-bold text-white">
              LipaPay
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
