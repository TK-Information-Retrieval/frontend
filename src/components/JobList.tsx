'use client';

import { MapPin, DollarSign } from 'lucide-react';
import { JobListing } from '@/types';

interface JobListProps {
  jobs: JobListing[];
  onJobClick: (jobId: string) => void;
}

export default function JobList({ jobs, onJobClick }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No jobs found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <div
          key={job.job_id}
          onClick={() => onJobClick(job.job_id)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.job_title}</h3>
          <p className="text-gray-600 text-sm mb-4">{job.company}</p>

          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{job.salary_range}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
