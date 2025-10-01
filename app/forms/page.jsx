import Link from 'next/link';
import { Card } from 'components/card';

export default function FormsPage() {
    const formTypes = [
        {
            id: 'participant-enrollment',
            title: 'Participant Enrollment',
            description: 'Enroll in the HCI-CDS program and access healthcare innovation services.',
            icon: '👤',
            status: 'active',
            estimatedTime: '15-20 minutes',
            requirements: ['Valid Medicaid number', 'Proof of identity', 'Emergency contact information'],
            category: 'Enrollment'
        },
        {
            id: 'care-plan',
            title: 'Care Plan',
            description: 'Create a comprehensive care plan for healthcare needs and service coordination.',
            icon: '📋',
            status: 'active',
            estimatedTime: '20-30 minutes',
            requirements: ['Participant enrollment', 'Care goals assessment', 'Service preferences'],
            category: 'Care Management'
        },
        {
            id: 'fms-authorization',
            title: 'FMS Authorization',
            description: 'Authorize Personal Assistants for Financial Management Services.',
            icon: '💰',
            status: 'active',
            estimatedTime: '10-15 minutes',
            requirements: ['Approved care plan', 'PA background check', 'Service authorization'],
            category: 'Financial Services'
        },
        {
            id: 'care-advisor-certification',
            title: 'Care Advisor Certification',
            description: 'Complete certification process for Care Advisors.',
            icon: '🎓',
            status: 'active',
            estimatedTime: '30-45 minutes',
            requirements: ['Professional credentials', 'Training completion', 'Supervision plan'],
            category: 'Professional Development'
        },
        {
            id: 'quality-assurance-audit',
            title: 'Quality Assurance Audit',
            description: 'Conduct quality assurance and compliance audits.',
            icon: '🔍',
            status: 'active',
            estimatedTime: '45-60 minutes',
            requirements: ['Audit authorization', 'Documentation access', 'Compliance checklist'],
            category: 'Quality Assurance'
        },
        {
            id: 'vendor-setup',
            title: 'FMS Vendor Setup',
            description: 'Set up Financial Management Service vendors and integrations.',
            icon: '🏢',
            status: 'active',
            estimatedTime: '60-90 minutes',
            requirements: ['Vendor agreement', 'Technical specifications', 'Integration testing'],
            category: 'System Administration'
        }
    ];

    const categories = [...new Set(formTypes.map(form => form.category))];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">HCI-CDS Forms</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Access and complete forms for the Health Care Innovation and Community Development Services program.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Quick Start</h2>
                    <p className="text-blue-800 text-sm">
                        New to the system? Start with Participant Enrollment to begin your journey with HCI-CDS.
                    </p>
                </div>
            </div>

            {/* Forms by Category */}
            {categories.map(category => (
                <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formTypes
                            .filter(form => form.category === category)
                            .map((form) => (
                                <Card key={form.id} className="h-full">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="text-3xl">{form.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{form.description}</p>
                                            
                                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                    {form.status}
                                                </span>
                                                <span>⏱️ {form.estimatedTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {form.requirements.map((req, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-gray-400 mr-2">•</span>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Link 
                                            href={`/${form.id}`}
                                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Start Form
                                        </Link>
                                        <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                                            Info
                                        </button>
                                    </div>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}

            {/* Help Section */}
            <div className="mt-12 bg-gray-50 rounded-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Form Assistance</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Contact your Care Advisor for guidance</li>
                            <li>• Review form requirements before starting</li>
                            <li>• Save your progress and return later</li>
                            <li>• Contact support: 919-855-3400</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Technical Support</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Ensure you have a stable internet connection</li>
                            <li>• Use a modern web browser (Chrome, Firefox, Safari)</li>
                            <li>• Clear your browser cache if experiencing issues</li>
                            <li>• Contact IT support: support@hci-forms.ncdhhs.gov</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Participant Enrollment</p>
                                    <p className="text-sm text-gray-500">Completed 2 hours ago</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Care Plan</p>
                                    <p className="text-sm text-gray-500">In progress - 60% complete</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">FMS Authorization</p>
                                    <p className="text-sm text-gray-500">Draft saved 1 day ago</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Draft</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}