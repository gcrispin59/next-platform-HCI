import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold text-white mb-4">HCI-CDS Forms</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Health Care Innovation & Community Development Services Forms Management System
                        </p>
                        <p className="text-gray-400 text-xs">
                            An official website of the State of North Carolina
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-white mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/forms" className="text-gray-300 hover:text-white">Form Submission</Link></li>
                            <li><Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
                            <li><Link href="/reports" className="text-gray-300 hover:text-white">Reports</Link></li>
                            <li><Link href="/admin" className="text-gray-300 hover:text-white">Administration</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/docs" className="text-gray-300 hover:text-white">Documentation</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-white">Support</Link></li>
                            <li><Link href="https://www.ncdhhs.gov" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">NCDHHS</Link></li>
                            <li><Link href="https://www.nc.gov" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">NC.GOV</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact</h4>
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>2101 Mail Service Center</p>
                            <p>Raleigh, NC 27699-2101</p>
                            <p>Phone: 919-855-3400</p>
                            <p>Email: hci-forms@ncdhhs.gov</p>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-400 mb-4 md:mb-0">
                            © 2024 North Carolina Department of Health and Human Services
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                            <Link href="/accessibility" className="text-gray-400 hover:text-white">Accessibility</Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Use</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
