import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Eye } from 'lucide-react'

interface Participant {
  participant_id: number
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
  status: string
  enrollment_date: string
}

export default function Participants() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchParticipants()
  }, [])

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants')
      const data = await response.json()
      setParticipants(data)
    } catch (error) {
      console.error('Failed to fetch participants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredParticipants = participants.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Participants</h1>
          <p className="mt-2 text-gray-600">
            Manage participant enrollments and information
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Participant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search participants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No participants found
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.participant_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {participant.first_name} {participant.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(participant.date_of_birth).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{participant.phone}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          participant.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {participant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(participant.enrollment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
