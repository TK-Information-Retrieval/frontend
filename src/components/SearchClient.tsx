'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, MapPin, DollarSign, Upload, Search, Calendar } from 'lucide-react';
import { useFile } from '@/lib/FileContext';
import { JobListing } from '@/types';
import { mockJobListings } from '@/types/mockJobs';

export default function SearchClient() {
  const { uploadedFile, setUploadedFile } = useFile();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'pdf'>('text'); // NEW
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.get('q');
    const mode = searchParams?.get('mode');

    if (mode === 'pdf') {
        setSearchMode('pdf');
    } else {
        setSearchMode('text');
    }

    // Run text search if mode is text OR mode is missing and query exists
    if ((mode === 'text' || !mode) && query) {
        setSearchQuery(query);
        handleTextSearch(query);
    }
  }, [searchParams]);


  useEffect(() => {
    if (searchMode !== 'pdf' || !uploadedFile) return;

    const fetchJobs = async () => {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        // const response = await axios.post('/resume-processing', formData);
        setJobs(mockJobListings); // fallback
      } catch (err) {
        console.error(err);
        setError('Error uploading CV. Please try again.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [uploadedFile, searchMode]);

  const handleTextSearch = (query: string) => {
    setJobs(
      mockJobListings.filter(
        (job) =>
          job.job_title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}&mode=text`);
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === 'application/pdf') {
      setUploadedFile(file);
      setError('');
    } else {
      setError('Only PDF files are allowed.');
    }
  };

  const handleRemoveCV = () => {
    setUploadedFile(null);
    setError('');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mode Switch */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            setSearchMode('text');
            setError('');
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            searchMode === 'text' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Search by Text
        </button>
        <button
          onClick={() => {
            setSearchMode('pdf');
            setSearchQuery('');
            setError('');
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            searchMode === 'pdf' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Search by CV
        </button>
      </div>

      {/* Search by Text */}
    {searchMode === 'text' && (
    <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="relative max-w-full mx-auto">
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
    )}


      {/* Upload CV */}
      {searchMode === 'pdf' && !uploadedFile && (
        <div className="mb-8">
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="inline-block px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4">
                Upload CV/Resume
              </span>
            </label>
            <p className="text-xs text-gray-500">Only PDF files are accepted</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
          </div>
        </div>
      )}

      {searchMode === 'pdf' && uploadedFile && (
        <div className="mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">Uploaded CV:</span>
              <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
            </div>
            <button onClick={handleRemoveCV} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.job_id}
              onClick={() => handleJobClick(job.job_id)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.job_title}</h3>
              <p className="text-gray-600 text-sm mb-4">{job.company}</p>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{job.location}, {job.country}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{job.salary_range} / year</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{job.work_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (uploadedFile || searchQuery) && (
        <p className="text-center text-gray-500">No matching jobs found.</p>
      )}
    </main>
  );
}
