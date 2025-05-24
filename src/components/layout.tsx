import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                SeekCareer
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link 
                  href="/" 
                  className={`hover:text-gray-900 ${
                    router.pathname === '/' ? 'text-gray-900' : 'text-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/search" 
                  className={`hover:text-gray-900 ${
                    router.pathname === '/search' ? 'text-gray-900' : 'text-gray-700'
                  }`}
                >
                  Job Postings
                </Link>
              </div>
            </div>
            <Link 
              href="/search-cv"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Upload CV
            </Link>
          </div>
        </div>
      </nav>
      
      {children}
    </div>
  );
};

export default Layout;