import { WalletConnect } from '@/components/dashboard/WalletConnect'
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'

export default function WalletsPage() {
  return (
    <div className="space-y-8">
      {/* Wallet Overview */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Wallet Overview</h2>
          <WalletConnect />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">USDC Balance</h3>
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">$12,345.67</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">SOL Balance</h3>
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">45.123 SOL</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Total Value (USD)</h3>
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">$14,567.89</p>
          </div>
        </div>
      </div>

      {/* Connected Wallets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Connected Wallets</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="text-white font-medium">Phantom Wallet</p>
                <p className="text-gray-400 text-sm">Connected: Feb 16, 2025</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300">Disconnect</button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Transactions</h2>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                {Math.random() > 0.5 ? (
                  <ArrowUpRight className="h-6 w-6 text-green-400 mr-3" />
                ) : (
                  <ArrowDownRight className="h-6 w-6 text-red-400 mr-3" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {Math.random() > 0.5 ? 'Received Payment' : 'Sent Payment'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  ${(Math.random() * 1000).toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">
                  {(Math.random() * 10).toFixed(2)} SOL
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
