import { ArrowUpRight, ArrowDownRight, Wallet, QrCode } from 'lucide-react'

export default function BusinessDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Total Revenue</h3>
            <ArrowUpRight className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">$24,563.00</p>
          <p className="text-sm text-green-400 mt-1">+15.3% from last month</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Total Transactions</h3>
            <ArrowUpRight className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">1,463</p>
          <p className="text-sm text-green-400 mt-1">+5.7% from last month</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Average Transaction</h3>
            <ArrowDownRight className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">$16.79</p>
          <p className="text-sm text-red-400 mt-1">-2.3% from last month</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Active Wallets</h3>
            <ArrowUpRight className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">892</p>
          <p className="text-sm text-green-400 mt-1">+12.1% from last month</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Wallet className="h-6 w-6 text-white mr-2" />
              <span className="text-white">Connect Wallet</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <QrCode className="h-6 w-6 text-white mr-2" />
              <span className="text-white">Generate QR</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Business ID</h3>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Your Business ID</p>
            <p className="text-2xl font-mono text-white">332288</p>
            <p className="text-gray-400 text-sm mt-2">Share this ID with your customers for direct payments</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    TX_{Math.random().toString(36).substr(2, 9)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${(Math.random() * 1000).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {Math.random() > 0.5 ? 'Payment' : 'Transfer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
