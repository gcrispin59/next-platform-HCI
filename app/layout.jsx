import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
    title: {
        template: '%s | HCI-CDS Forms Management',
        default: 'HCI-CDS Forms Management System'
    },
    description: 'North Carolina Health Care Innovation and Community Development Services - Forms Management System',
    keywords: ['hci-cds', 'north-carolina', 'healthcare', 'forms', 'community-development', 'ncdhhs']
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-gray-900 bg-white">
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="grow bg-gray-50">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
