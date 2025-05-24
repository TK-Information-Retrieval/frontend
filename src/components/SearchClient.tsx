'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import SearchBar from './SearchBar';
import JobList from './JobList';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type?: string;
}

const mockJobs: JobListing[] = [
  { id: '1', title: 'Web Developer', company: 'PT Awan Hujan', location: 'Jakarta Selatan', salary: '8M-10M/month' },
  { id: '2', title: 'Web Developer', company: 'PT Awan Hujan', location: 'Jakarta Selatan', salary: '8M-10M/month' },
  { id: '3', title: 'Web Developer', company: 'PT Awan Hujan', location: 'Jakarta Selatan', salary: '8M-10M/month' },
  { id: '4', title: 'Web Developer', company: 'PT Awan Hujan', location: 'Jakarta Selatan', salary: '8M-10M/month' },
  { id: '5', title: 'Web Developer', company: 'PT Awan Hujan', location: 'Jakarta Selatan', salary: '8M-10M/month' },
  { id: '6', title: 'Web Developer', company: 'PT Awan Hujan', location: 'Jakarta Selatan', salary: '8M-10M/month' },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<JobListing[]>(mockJobs);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredJobs = mockJobs.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setJobs(filteredJobs);
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
    <JobList jobs={jobs} onJobClick={handleJobClick} />
    </main>
  );
}
