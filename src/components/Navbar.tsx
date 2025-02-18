import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">LipaPay</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/docs" className="text-gray-300 hover:text-white px-3 py-2">
                Docs
              </Link>
              <Link href="/branding" className="text-gray-300 hover:text-white px-3 py-2">
                Branding
              </Link>
              <Link href="https://github.com/lipapay" className="text-gray-300 hover:text-white px-3 py-2">
                GitHub
              </Link>
              <Link href="/solana-pay-101" className="text-gray-300 hover:text-white px-3 py-2">
                Solana Pay 101
              </Link>
              <Link href="/business" className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200">
                For Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
