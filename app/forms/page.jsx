import Link from 'next/link';
import { Card } from 'components/card';

export default function FormsPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <h1 className="text-4xl font-bold mb-4">Forms Management</h1>
                <p className="text-xl text-blue-100 mb-8">
                    Create, manage, and submit intelligent forms with AI-powered assistance
                </p>
            </section>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Create New Form" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Start with our AI-powered form generator that creates intelligent forms based on your requirements.
                    </p>
                    <Link href="/forms/create" className="btn bg-blue-600 hover:bg-blue-700 text-white">
                        Create Form
                    </Link>
                </Card>

                <Card title="My Forms" className="h-full">
                    <p className="text-gray-300 mb-4">
                        View and manage all your created forms, track submissions, and monitor progress.
                    </p>
                    <Link href="/forms/list" className="btn bg-green-600 hover:bg-green-700 text-white">
                        View Forms
                    </Link>
                </Card>

                <Card title="Form Templates" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Browse pre-built templates for common healthcare forms and documentation.
                    </p>
                    <Link href="/forms/templates" className="btn bg-purple-600 hover:bg-purple-700 text-white">
                        Browse Templates
                    </Link>
                </Card>
            </section>

            <section className="bg-blue-800/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-900/50 rounded-lg">
                        <div>
                            <h3 className="font-semibold">Patient Intake Form</h3>
                            <p className="text-sm text-gray-400">Last modified: 2 hours ago</p>
                        </div>
                        <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-900/50 rounded-lg">
                        <div>
                            <h3 className="font-semibold">Insurance Verification</h3>
                            <p className="text-sm text-gray-400">Last modified: 1 day ago</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">Pending</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
