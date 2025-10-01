import { Card } from 'components/card';

export default function ContactPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-xl text-blue-100 mb-8">
                    Get in touch with our team for support, questions, or partnership opportunities
                </p>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
                <Card title="Get in Touch" className="h-full">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                            <select
                                id="subject"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select a subject</option>
                                <option value="support">Technical Support</option>
                                <option value="sales">Sales Inquiry</option>
                                <option value="partnership">Partnership</option>
                                <option value="feature">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                            <textarea
                                id="message"
                                rows="4"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tell us how we can help you..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                        >
                            Send Message
                        </button>
                    </form>
                </Card>

                <Card title="Contact Information" className="h-full">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Email Support</h3>
                            <p className="text-gray-300 mb-2">support@hci-forms.com</p>
                            <p className="text-sm text-gray-400">Available 24/7 for technical support</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Sales Inquiries</h3>
                            <p className="text-gray-300 mb-2">sales@hci-forms.com</p>
                            <p className="text-sm text-gray-400">Monday - Friday, 9 AM - 6 PM EST</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Partnership</h3>
                            <p className="text-gray-300 mb-2">partnerships@hci-forms.com</p>
                            <p className="text-sm text-gray-400">For integration and partnership opportunities</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Emergency Support</h3>
                            <p className="text-gray-300 mb-2">+1 (555) 123-4567</p>
                            <p className="text-sm text-gray-400">Critical system issues only</p>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
                <Card title="Technical Support" className="text-center">
                    <div className="text-4xl mb-4">🔧</div>
                    <h3 className="font-semibold mb-2">Technical Issues</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Get help with platform setup, integrations, and technical problems
                    </p>
                    <button className="btn bg-blue-600 hover:bg-blue-700 text-white w-full">
                        Get Support
                    </button>
                </Card>

                <Card title="Sales & Pricing" className="text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="font-semibold mb-2">Sales Questions</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Learn about pricing, features, and how to get started
                    </p>
                    <button className="btn bg-green-600 hover:bg-green-700 text-white w-full">
                        Contact Sales
                    </button>
                </Card>

                <Card title="Partnership" className="text-center">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="font-semibold mb-2">Partnership Opportunities</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Explore integration and partnership possibilities
                    </p>
                    <button className="btn bg-purple-600 hover:bg-purple-700 text-white w-full">
                        Partner With Us
                    </button>
                </Card>
            </section>

            <section className="bg-blue-800/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Office Information</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">North Carolina Office</h3>
                        <div className="space-y-2 text-gray-300">
                            <p>123 Healthcare Drive</p>
                            <p>Raleigh, NC 27601</p>
                            <p>United States</p>
                            <p className="mt-4">
                                <strong>Phone:</strong> +1 (555) 123-4567
                            </p>
                            <p>
                                <strong>Email:</strong> info@hci-forms.com
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                        <div className="space-y-2 text-gray-300">
                            <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                            <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                            <p><strong>Sunday:</strong> Closed</p>
                            <p className="mt-4 text-sm text-gray-400">
                                Emergency support available 24/7 for critical issues
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
