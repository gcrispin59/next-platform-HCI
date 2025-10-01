import { Card } from 'components/card';

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <h1 className="text-4xl font-bold mb-4">Administration Panel</h1>
                <p className="text-xl text-blue-100 mb-8">
                    Manage system settings, users, and AI agent configurations
                </p>
            </section>

            {/* Admin Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="System Health" className="text-center">
                    <div className="text-3xl font-bold text-green-400">98.5%</div>
                    <p className="text-sm text-gray-400">Uptime</p>
                </Card>
                <Card title="Active Users" className="text-center">
                    <div className="text-3xl font-bold text-blue-400">47</div>
                    <p className="text-sm text-gray-400">Currently online</p>
                </Card>
                <Card title="AI Agent Status" className="text-center">
                    <div className="text-3xl font-bold text-purple-400">5/5</div>
                    <p className="text-sm text-gray-400">Agents running</p>
                </Card>
            </section>

            {/* Admin Tools */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="User Management" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Manage user accounts, permissions, and access levels.
                    </p>
                    <button className="btn bg-blue-600 hover:bg-blue-700 text-white w-full">
                        Manage Users
                    </button>
                </Card>

                <Card title="AI Agent Configuration" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Configure AI agent settings, prompts, and behavior parameters.
                    </p>
                    <button className="btn bg-purple-600 hover:bg-purple-700 text-white w-full">
                        Configure Agents
                    </button>
                </Card>

                <Card title="System Analytics" className="h-full">
                    <p className="text-gray-300 mb-4">
                        View detailed analytics, performance metrics, and usage reports.
                    </p>
                    <button className="btn bg-green-600 hover:bg-green-700 text-white w-full">
                        View Analytics
                    </button>
                </Card>

                <Card title="Integration Settings" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Manage ARMS, FMS, and other system integrations.
                    </p>
                    <button className="btn bg-yellow-600 hover:bg-yellow-700 text-white w-full">
                        Manage Integrations
                    </button>
                </Card>

                <Card title="Form Templates" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Create and manage form templates and validation rules.
                    </p>
                    <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                        Manage Templates
                    </button>
                </Card>

                <Card title="System Logs" className="h-full">
                    <p className="text-gray-300 mb-4">
                        View system logs, error reports, and audit trails.
                    </p>
                    <button className="btn bg-red-600 hover:bg-red-700 text-white w-full">
                        View Logs
                    </button>
                </Card>
            </section>

            {/* System Status */}
            <section className="bg-blue-800/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">System Status</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Service Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Web Server</span>
                                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Operational</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Database</span>
                                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>AI Processing</span>
                                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Email Service</span>
                                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">Online</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Response Time</span>
                                <span className="text-green-400">245ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>CPU Usage</span>
                                <span className="text-green-400">23%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Memory</span>
                                <span className="text-green-400">1.2GB</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Storage</span>
                                <span className="text-green-400">45%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
