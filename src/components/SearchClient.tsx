'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, MapPin, DollarSign, Upload, Search, Calendar } from 'lucide-react';
import { useFile } from '@/lib/FileContext';
import { JobListing } from '@/types';
import { mockJobListings } from '@/types/mockJobs';

interface ApiJobResult {
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  salary_range: string;
}

interface SuggestionsResponse {
  results: string[];
}

interface JobsResponse {
  results: ApiJobResult[];
}

export default function SearchClient() {
  const { uploadedFile, setUploadedFile } = useFile();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'pdf'>('text');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const JOB_API_BASE_URL = process.env.NEXT_PUBLIC_JOB_API_BASE_URL || '';
  const CV_API_BASE_URL = process.env.NEXT_PUBLIC_CV_API_BASE_URL || '';

  // Load initial jobs when component mounts
  useEffect(() => {
    const query = searchParams?.get('q');
    if (searchMode === 'text') {
        if (!query) {
            loadInitialJobs();
        }
    }
  }, [searchMode]);

  useEffect(() => {
    const query = searchParams?.get('q');
    const mode = searchParams?.get('mode');

    if (mode === 'pdf') {
      setSearchMode('pdf');
    } else {
      setSearchMode('text');
    }

    // Run text search if mode is text OR mode is missing and query exists
    if (mode === 'text') {
        setSearchQuery(query || '');
        handleApiSearch(query || '');
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
            const response = await fetch(`${CV_API_BASE_URL}/process-resume`, {
            method: 'POST',
            body: formData,
            });

            if (!response.ok) {
            throw new Error('Failed to fetch jobs');
            }

            const data = await response.json();

            // Extract job results
            const jobResults = data.search_engine_result?.results || [];

            const mappedJobs: JobListing[] = jobResults.map((job: any) => ({
            job_id: job.job_id,
            job_title: job.job_title,
            company: job.company,
            location: job.location,
            country: '', // still unknown from API
            salary_range: job.salary_range,
            work_type: '', // still unknown from API
            }));

            setJobs(mappedJobs);

            // Optionally: save summary if needed
            // setSummary(data.summary); // if you want to show the resume summary somewhere

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadInitialJobs = async () => {
    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${JOB_API_BASE_URL}/api/jobs`);
        if (!response.ok) {
        throw new Error('Failed to fetch jobs');
        }
        
        const data: JobsResponse = await response.json();
        const mappedJobs: JobListing[] = data.results.map(job => ({
        job_id: job.job_id,
        job_title: job.job_title,
        company: job.company,
        location: job.location,
        country: '',
        salary_range: job.salary_range,
        work_type: '', 
        }));
        
        setJobs(mappedJobs);
    } catch (err) {
        console.error('Error loading initial jobs:', err);
        setError('Failed to load jobs. Please try again.');
        // Fallback to mock data
        setJobs(mockJobListings);
    } finally {
        setLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    
    try {
      const response = await fetch(`${JOB_API_BASE_URL}/api/suggest?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data: SuggestionsResponse = await response.json();
      setSuggestions(data.results);
      setShowSuggestions(data.results.length > 0);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms debounce
  }, []);

  const handleApiSearch = async (query: string) => {
    if (!query.trim()) {
      loadInitialJobs();
      return;
    }

    setLoading(true);
    setError('');
    setShowSuggestions(false);

    try {
      const response = await fetch(`${JOB_API_BASE_URL}/api/search?query=${encodeURIComponent(query)}&num_results=8`);
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }
      
      const data: JobsResponse = await response.json();
      const mappedJobs: JobListing[] = data.results.map(job => ({
        job_id: job.job_id,
        job_title: job.job_title,
        company: job.company,
        location: job.location,
        country: '', // API doesn't provide country
        salary_range: job.salary_range,
        work_type: '', // API doesn't provide work_type
      }));
      
      setJobs(mappedJobs);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchSuggestions(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}&mode=text`);
        handleApiSearch(searchQuery);
    }
    };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}&mode=text`);
    handleApiSearch(suggestion);
  };

  const handleJobClick = (jobId: string) => {
    console.log(`navigating to job detail id ${jobId}`)
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
    setJobs([]);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mode Switch */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            setSearchMode('text');
            router.push(`/search?mode=text`);
            setError('');
            setShowSuggestions(false);
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
            router.push(`/search?mode=pdf`);
            setJobs([])
            setSearchQuery('');
            setError('');
            setShowSuggestions(false);
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
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="relative max-w-full mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Find your dream job today"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-pink-400 hover:text-pink-600"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto"
              >
                {loadingSuggestions && (
                  <div className="px-4 py-2 text-gray-500 text-sm">Loading suggestions...</div>
                )}
                {!loadingSuggestions && suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
                {!loadingSuggestions && suggestions.length === 0 && searchQuery && (
                  <div className="px-4 py-2 text-gray-500 text-sm">No suggestions found</div>
                )}
              </div>
            )}
          </form>
        </div>
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
      
      {searchMode === 'pdf' && uploadedFile && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Jobs matched with your CV</h2>
        </div>
      )}

      {searchMode === 'text' && searchQuery && !loading && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Search results for "{searchQuery}"
          </h2>
        </div>
      )}

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
                <span>{job.location}{job.country && `, ${job.country}`}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{job.salary_range} / year</span>
              </div>
              {job.work_type && (
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{job.work_type}</span>
                </div>
              )}
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