import { Link, useLocation } from 'react-router-dom'
import { 
  Home, Users, FileText, UserCheck, Bot, 
  Settings, LogOut, Menu, X 
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Participants', href: '/participants', icon: Users },
    { name: 'Care Plans', href: '/care-plans', icon: FileText },
    { name: 'Personal Assistants', href: '/personal-assistants', icon: UserCheck },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="text-xl font-bold text-blue-600">NC HCI-CDS</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 px-6 border-b">
            <span className="text-xl font-bold text-blue-600">NC HCI-CDS</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold text-blue-600">NC HCI-CDS</span>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
