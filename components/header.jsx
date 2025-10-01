import Link from 'next/link';

// Key workflow personas and their navigation
const workflowPersonas = [
    {
        title: 'Healthcare Providers',
        items: [
            { linkText: 'Participant Enrollment', href: '/participant-enrollment' },
            { linkText: 'Care Advisor Interview', href: '/care-advisor-interview' },
            { linkText: 'Care Plans', href: '/care-plan' },
            { linkText: 'FMS Authorization', href: '/fms-authorization' },
            { linkText: 'All Forms', href: '/forms' }
        ]
    },
    {
        title: 'Community Coordinators',
        items: [
            { linkText: 'Program Management', href: '/programs' },
            { linkText: 'Participant Tracking', href: '/participants' },
            { linkText: 'Quality Assurance', href: '/quality-assurance-audit' },
            { linkText: 'Community Resources', href: '/resources' }
        ]
    },
    {
        title: 'Administrators',
        items: [
            { linkText: 'System Management', href: '/admin' },
            { linkText: 'Analytics', href: '/analytics' },
            { linkText: 'User Management', href: '/users' },
            { linkText: 'Vendor Setup', href: '/vendor-setup' }
        ]
    }
];

const utilityMenu = [
    { linkText: 'NCDHHS', href: 'https://www.ncdhhs.gov' },
    { linkText: 'NC.GOV', href: 'https://www.nc.gov' },
    { linkText: 'AGENCIES', href: 'https://www.nc.gov/agencies' },
    { linkText: 'JOBS', href: 'https://www.nc.gov/jobs' }
];

export function Header() {
    return (
        <header className="bg-white border-b border-gray-200">
            {/* Utility Menu */}
            <div className="bg-blue-900 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex space-x-6">
                            {utilityMenu.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="hover:text-blue-200 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.linkText}
                                </Link>
                            ))}
                        </div>
                        <div className="text-xs">
                            An official website of the State of North Carolina
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-lg">HCI</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">HCI-CDS Forms</h1>
                                <p className="text-sm text-gray-600">Health Care Innovation & Community Development Services</p>
                            </div>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                            Home
                        </Link>
                        <Link href="/forms" className="text-gray-700 hover:text-blue-600 font-medium">
                            Forms
                        </Link>
                        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                            Dashboard
                        </Link>
                        <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                            Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Workflow Personas Navigation */}
            <div className="bg-gray-100 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">Workflow Access by Role:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {workflowPersonas.map((persona, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                                    <h3 className="font-semibold text-gray-900 mb-2">{persona.title}</h3>
                                    <ul className="space-y-1">
                                        {persona.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <Link 
                                                    href={item.href} 
                                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {item.linkText}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
