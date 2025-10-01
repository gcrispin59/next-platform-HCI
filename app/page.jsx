import Link from 'next/link';
import { Card } from 'components/card';

export default function Page() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    <section className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">HCI-CDS Forms Management System</h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Streamlined form processing for North Carolina Health Care Innovation and Community Development Services programs.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <p className="text-blue-800">
                                <strong>System Status:</strong> All systems operational. Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </section>

                    {/* What We Do */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
                        <p className="text-gray-700 mb-4">
                            The HCI-CDS Forms Management System streamlines the processing of healthcare innovation and community development forms, 
                            ensuring efficient data collection, validation, and submission for North Carolina&apos;s healthcare programs.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="font-semibold text-gray-900 mb-2">Form Processing</h3>
                                <p className="text-gray-600 text-sm">
                                    Automated form validation, data extraction, and submission processing for healthcare programs.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="font-semibold text-gray-900 mb-2">Data Integration</h3>
                                <p className="text-gray-600 text-sm">
                                    Seamless integration with ARMS, FMS, and other state healthcare management systems.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Services */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Services</h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-400 pl-4">
                                <h3 className="font-semibold text-gray-900">Form Management</h3>
                                <p className="text-gray-600 text-sm">Create, manage, and process healthcare innovation forms</p>
                            </div>
                            <div className="border-l-4 border-green-400 pl-4">
                                <h3 className="font-semibold text-gray-900">Data Validation</h3>
                                <p className="text-gray-600 text-sm">Automated validation and error checking for all submissions</p>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-4">
                                <h3 className="font-semibold text-gray-900">System Integration</h3>
                                <p className="text-gray-600 text-sm">Connect with existing state healthcare management systems</p>
                            </div>
                            <div className="border-l-4 border-yellow-400 pl-4">
                                <h3 className="font-semibold text-gray-900">Reporting & Analytics</h3>
                                <p className="text-gray-600 text-sm">Comprehensive reporting and data analytics for program oversight</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Access</h3>
                        <div className="space-y-3">
                            <Link href="/forms" className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                Submit New Form
                            </Link>
                            <Link href="/dashboard" className="block w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                View Dashboard
                            </Link>
                            <Link href="/reports" className="block w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                Generate Reports
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">System Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="text-green-600 font-medium">Operational</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Last Update:</span>
                                <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Active Users:</span>
                                <span className="text-gray-900">47</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                        <p className="text-blue-800 text-sm mb-3">
                            Contact our support team for assistance with form submission or system access.
                        </p>
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Get Support →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Announcements */}
            <section className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Announcements and Public Notices</h2>
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                            <p className="text-gray-800 font-medium">System Maintenance Scheduled</p>
                            <p className="text-gray-600 text-sm">Planned maintenance window: Sunday, 2:00 AM - 4:00 AM EST</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                            <p className="text-gray-800 font-medium">New Form Templates Available</p>
                            <p className="text-gray-600 text-sm">Updated templates for Q4 2024 reporting requirements</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
