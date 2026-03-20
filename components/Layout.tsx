import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Simple CRM' }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/customers" className="text-2xl font-bold">
            Simple CRM
          </Link>
          <nav>
            <Link href="/customers" className="mr-4 hover:underline">
              Customers
            </Link>
            <Link href="/customers/new" className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Customer
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8 text-center">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Simple CRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;