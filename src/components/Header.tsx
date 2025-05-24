'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-gray-900">SeekCareer</h1>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <Link href="/search" className="text-gray-500 hover:text-gray-700">Job Postings</Link>
            </nav>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Upload CV
          </button>
        </div>
      </div>
    </header>
  );
}
