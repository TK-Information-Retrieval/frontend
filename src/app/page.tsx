'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Upload } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
      }
    }
  };

  const handleCVSearch = () => {
    if (uploadedFile) {
      router.push('/search-cv');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">SeekCareer</h1>
              <nav className="flex space-x-8">
                <a href="/" className="text-gray-900 hover:text-gray-700">Home</a>
                <a href="/search" className="text-gray-500 hover:text-gray-700">Job Postings</a>
              </nav>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Upload CV
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-300 rounded"></div>
              </div>
              <div className="absolute -left-4 top-8 w-12 h-12 bg-pink-100 rounded-lg"></div>
            </div>
          </div>
          
          <div className="mb-8">
            <span className="inline-block bg-pink-200 text-pink-800 px-6 py-2 rounded-full text-lg font-medium mb-4">
              success
            </span>
            <h2 className="text-3xl font-normal text-gray-900">starts here.</h2>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your dream job today"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-pink-400 hover:text-pink-600"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>

          <p className="text-gray-500 mb-8">or</p>

          <h3 className="text-2xl font-normal text-gray-900 mb-8">find your best match job</h3>

          {/* File Upload Area */}
          <div
              className={`relative max-w-md mx-auto border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-300 bg-white'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
            <div className="mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            </div>
            
            {uploadedFile ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded:</p>
                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                <button
                  onClick={handleCVSearch}
                  className="mt-4 px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
                >
                  Search Jobs with CV
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="file-upload">
                  <span className="inline-block px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4 cursor-pointer">
                    Upload CV/Resume
                  </span>
                </label>
                <p className="text-xs text-gray-500">or drop your file here</p>
              </>
            )}
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
          </div>
        </div>
      </main>
    </div>
  );
}