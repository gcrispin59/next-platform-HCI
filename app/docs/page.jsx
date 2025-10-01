import Link from 'next/link';
import { Card } from 'components/card';

export default function DocsPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                <p className="text-xl text-blue-100 mb-8">
                    Learn how to use the HCI-Forms platform effectively
                </p>
            </section>

            {/* Quick Start Guide */}
            <section className="grid md:grid-cols-2 gap-8">
                <Card title="Getting Started" className="h-full">
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                            <h3 className="font-semibold mb-2">1. Create Your First Form</h3>
                            <p className="text-sm text-gray-400">Learn how to generate intelligent forms using our AI-powered system.</p>
                        </div>
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                            <h3 className="font-semibold mb-2">2. Configure Integrations</h3>
                            <p className="text-sm text-gray-400">Set up ARMS and FMS integrations for seamless data flow.</p>
                        </div>
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                            <h3 className="font-semibold mb-2">3. Deploy and Monitor</h3>
                            <p className="text-sm text-gray-400">Deploy your forms and monitor their performance.</p>
                        </div>
                    </div>
                </Card>

                <Card title="API Reference" className="h-full">
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                            <h3 className="font-semibold mb-2">Form Generation API</h3>
                            <p className="text-sm text-gray-400">Generate forms programmatically using our REST API.</p>
                        </div>
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                            <h3 className="font-semibold mb-2">Validation Engine</h3>
                            <p className="text-sm text-gray-400">Integrate real-time validation into your applications.</p>
                        </div>
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                            <h3 className="font-semibold mb-2">AI Agent API</h3>
                            <p className="text-sm text-gray-400">Interact directly with our AI agents for custom workflows.</p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Documentation Sections */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="User Guide" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Complete guide for end users on creating and managing forms.
                    </p>
                    <Link href="/docs/user-guide" className="btn bg-blue-600 hover:bg-blue-700 text-white w-full">
                        Read User Guide
                    </Link>
                </Card>

                <Card title="Developer Guide" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Technical documentation for developers and system integrators.
                    </p>
                    <Link href="/docs/developer-guide" className="btn bg-green-600 hover:bg-green-700 text-white w-full">
                        Read Developer Guide
                    </Link>
                </Card>

                <Card title="API Documentation" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Comprehensive API reference with examples and code samples.
                    </p>
                    <Link href="/docs/api" className="btn bg-purple-600 hover:bg-purple-700 text-white w-full">
                        View API Docs
                    </Link>
                </Card>

                <Card title="Integration Guide" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Step-by-step guides for integrating with ARMS, FMS, and other systems.
                    </p>
                    <Link href="/docs/integrations" className="btn bg-yellow-600 hover:bg-yellow-700 text-white w-full">
                        View Integrations
                    </Link>
                </Card>

                <Card title="Troubleshooting" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Common issues, solutions, and troubleshooting guides.
                    </p>
                    <Link href="/docs/troubleshooting" className="btn bg-red-600 hover:bg-red-700 text-white w-full">
                        View Troubleshooting
                    </Link>
                </Card>

                <Card title="Best Practices" className="h-full">
                    <p className="text-gray-300 mb-4">
                        Recommended practices for optimal form design and performance.
                    </p>
                    <Link href="/docs/best-practices" className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                        View Best Practices
                    </Link>
                </Card>
            </section>

            {/* FAQ Section */}
            <section className="bg-blue-800/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div className="border-b border-blue-700 pb-4">
                        <h3 className="font-semibold mb-2">How does the AI form generation work?</h3>
                        <p className="text-gray-300 text-sm">
                            Our multi-agent AI system analyzes your requirements and generates intelligent forms with appropriate fields, validation rules, and user experience optimizations.
                        </p>
                    </div>
                    <div className="border-b border-blue-700 pb-4">
                        <h3 className="font-semibold mb-2">Can I integrate with existing systems?</h3>
                        <p className="text-gray-300 text-sm">
                            Yes, the platform supports integration with ARMS, FMS, and other healthcare management systems through our comprehensive API.
                        </p>
                    </div>
                    <div className="border-b border-blue-700 pb-4">
                        <h3 className="font-semibold mb-2">Is my data secure?</h3>
                        <p className="text-gray-300 text-sm">
                            Absolutely. We follow healthcare industry standards for data security and compliance, including HIPAA requirements.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">How do I get support?</h3>
                        <p className="text-gray-300 text-sm">
                            Contact our support team through the contact page or email support@hci-forms.com for assistance.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
