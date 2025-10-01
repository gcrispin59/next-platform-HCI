import { Card } from 'components/card';

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-xl text-blue-100 mb-8">
                    Monitor your forms, analytics, and system performance
                </p>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Forms" className="text-center">
                    <div className="text-3xl font-bold text-blue-400">24</div>
                    <p className="text-sm text-gray-400">+3 this week</p>
                </Card>
                <Card title="Active Submissions" className="text-center">
                    <div className="text-3xl font-bold text-green-400">12</div>
                    <p className="text-sm text-gray-400">In progress</p>
                </Card>
                <Card title="Completed This Month" className="text-center">
                    <div className="text-3xl font-bold text-purple-400">156</div>
                    <p className="text-sm text-gray-400">+12% from last month</p>
                </Card>
                <Card title="AI Processing Time" className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">2.3s</div>
                    <p className="text-sm text-gray-400">Average response</p>
                </Card>
            </section>

            {/* Charts and Analytics */}
            <section className="grid md:grid-cols-2 gap-8">
                <Card title="Form Submissions Over Time">
                    <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Chart visualization would go here</p>
                    </div>
                </Card>
                <Card title="Form Completion Rates">
                    <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Pie chart visualization would go here</p>
                    </div>
                </Card>
            </section>

            {/* Recent Activity */}
            <section className="grid md:grid-cols-2 gap-8">
                <Card title="Recent Form Submissions">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-900/50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">Patient Registration</h4>
                                <p className="text-sm text-gray-400">Submitted 2 hours ago</p>
                            </div>
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Completed</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-900/50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">Insurance Verification</h4>
                                <p className="text-sm text-gray-400">Submitted 4 hours ago</p>
                            </div>
                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Processing</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-900/50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">Medical History</h4>
                                <p className="text-sm text-gray-400">Submitted 1 day ago</p>
                            </div>
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Completed</span>
                        </div>
                    </div>
                </Card>

                <Card title="System Status">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>AI Agents</span>
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Online</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>ARMS Integration</span>
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Connected</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>FMS Integration</span>
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Connected</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Email Service</span>
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Active</span>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
