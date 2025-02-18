import { Navbar } from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-16">
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              <h1 className="text-6xl font-bold leading-tight">
                Get instant settlement with near-zero fees.
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl">
                Solana Pay, an open, free-to-use payments framework built on Solana, 
                is available to millions of businesses as an approved app integration 
                on Shopify. Solana Pay is built for instant transactions and near-zero 
                gas fees.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/install"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#00FF84] hover:bg-[#00FF84]/90"
                >
                  INSTALL THE APP
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10"
                >
                  SOLANA PAY DOCS
                </Link>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="flex-1 relative h-[400px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg transform rotate-3">
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-8">
                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32">
                      <Image
                        src="/lipapay-logo.svg"
                        alt="LipaPay Logo"
                        width={128}
                        height={128}
                      />
                    </div>
                    <div className="text-5xl font-bold">×</div>
                    <div className="w-32 h-32">
                      <Image
                        src="/shopify-logo.svg"
                        alt="Shopify Logo"
                        width={128}
                        height={128}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="bg-black/50 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold mb-16">
              Now your business can harness the power of the blockchain at the same 
              speed as traditional payment networks. No more intermediaries. It's just 
              you and your customers.
            </h2>
          </div>
        </section>
      </div>
    </>
  )
}
