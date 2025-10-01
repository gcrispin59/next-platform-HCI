import { Users, FileText, UserCheck, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      name: 'Active Participants',
      value: '248',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Care Plans',
      value: '189',
      change: '+8%',
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      name: 'Personal Assistants',
      value: '156',
      change: '+5%',
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'Compliance Rate',
      value: '98.5%',
      change: '+2%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          NC Home Care Independence - Consumer Directed Services
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-2 text-sm text-green-600">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h2>
          <div className="space-y-4">
            {[
              { name: 'John Smith', date: '2024-01-15', status: 'Completed' },
              { name: 'Mary Johnson', date: '2024-01-14', status: 'In Progress' },
              { name: 'Robert Davis', date: '2024-01-13', status: 'Completed' },
            ].map((enrollment, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{enrollment.name}</p>
                  <p className="text-sm text-gray-600">{enrollment.date}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  enrollment.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {enrollment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reviews</h2>
          <div className="space-y-4">
            {[
              { name: 'Sarah Williams', type: 'Care Plan Review', date: '2024-01-20' },
              { name: 'Michael Brown', type: 'Annual Assessment', date: '2024-01-22' },
              { name: 'Lisa Anderson', type: 'Budget Review', date: '2024-01-25' },
            ].map((review, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.type}</p>
                </div>
                <p className="text-sm font-medium text-blue-600">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Access */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">AI Assistant Ready</h2>
            <p className="mt-1 text-blue-100">
              Get help with forms, eligibility checks, and care plan creation
            </p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Start Session
          </button>
        </div>
      </div>
    </div>
  )
}
