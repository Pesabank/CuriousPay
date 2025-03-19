'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Docs', href: '/docs' },
  { name: 'About Us', href: '/about' },
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'For Business', href: '/business' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">CuriousPay</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-gray-300 hover:text-white px-3 py-2 ${
                      isActive ? 'text-white' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-gray-200 rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
