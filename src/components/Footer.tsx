'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-gray-900">SeekCareer</h2>
            </Link>
            <p className="text-gray-600 text-lg">Find Your Dream Job</p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                Job Postings
              </Link>
            </nav>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Developers</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <div className="mt-1 space-y-1">
                  <div>Fresty Tania Stearine</div>
                  <div>Iqbal Pahlevi Amin</div>
                  <div>Naila Shafirni Hidayat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SeekCareer. Group Project - Information Retrieval.
            </p>
            <p className="text-sm text-gray-500">
              Developed by Fresty, Iqbal, & Naila
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}