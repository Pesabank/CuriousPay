import { Bell, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-white">Business Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button className="flex text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <User className="h-8 w-8 rounded-full p-1 bg-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
