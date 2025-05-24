'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, DollarSign } from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
}

const mockMatchedJobs: JobListing[] = [
  {
    id: '1',
    title: 'Web Developer',
    company: 'PT Awan Hujan - Intern',
    location: 'Jakarta Selatan',
    salary: '2M-3M/month',
    type: 'Intern'
  },
  {
    id: '2',
    title: 'Web Developer',
    company: 'PT Awan Hujan - Fulltime',
    location: 'Jakarta Selatan',
    salary: '8M-10M/month',
    type: 'Fulltime'
  },
  {
    id: '3',
    title: 'Web Developer',
    company: 'PT Awan Hujan - Fulltime',
    location: 'Jakarta Selatan',
    salary: '8M-10M/month',
    type: 'Fulltime'
  },
  {
    id: '4',
    title: 'Web Developer',
    company: 'PT Awan Hujan - Fulltime',
    location: 'Jakarta Selatan',
    salary: '8M-10M/month',
    type: 'Fulltime'
  },
  {
    id: '5',
    title: 'Web Developer',
    company: 'PT Awan Hujan - Fulltime',
    location: 'Jakarta Selatan',
    salary: '8M-10M/month',
    type: 'Fulltime'
  },
  {
    id: '6',
    title: 'Web Developer',
    company: 'PT Awan Hujan - Fulltime',
    location: 'Jakarta Selatan',
    salary: '8M-10M/month',
    type: 'Fulltime'
  }
];

export default function SearchCVPage() {
  const [uploadedCV, setUploadedCV] = useState('CV_new.pdf');
  const [jobs, _] = useState<JobListing[]>(mockMatchedJobs);
  const router = useRouter();

  const handleRemoveCV = () => {
    setUploadedCV('');
    router.push('/');
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  const handleSearchJob = () => {
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Uploaded CV Display */}
        {uploadedCV && (
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">Uploaded CV:</span>
                <span className="text-sm font-medium text-gray-900">{uploadedCV}</span>
              </div>
              <button
                onClick={handleRemoveCV}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Matched Jobs Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Jobs matched with your CV</h2>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => handleJobClick(job.id)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{job.company}</p>
              
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{job.salary}</span>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No matching jobs found for your CV.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
            >
              Upload New CV
            </button>
          </div>
        )}
      </main>
    </div>
  );
}