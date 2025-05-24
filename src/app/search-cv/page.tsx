'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { X, MapPin, DollarSign, Upload } from 'lucide-react';
import { useFile } from '../../lib/FileContext';
import { JobListing } from '@/types';
import { mockJobListings } from '@/types/mockJobs';

export default function SearchCVPage() {
  const { uploadedFile, setUploadedFile } = useFile();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (uploadedFile) {
      const fetchJobs = async () => {
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
          // const response = await axios.post('/resume-processing', formData, {
          //   headers: { 'Content-Type': 'multipart/form-data' },
          // });

          // if (response.data.content.success) {
          //   const jobResults: JobListing[] = response.data.content.search_engine_result.map(
          //     (job: any) => ({
          //       job_id: job.job_id,
          //       job_title: job.job_title,
          //       company: job.company,
          //       location: job.location,
          //       salary_range: job.salary_range,
          //       work_type: job.work_type,
          //     })
          //   );

          //   setJobs(jobResults);
          // } else {
            //   setError('Failed to process resume.');
            //   setJobs([]);
            // }
            setJobs(mockJobListings);
        } catch (err) {
          console.error(err);
          setError('Error uploading CV. Please try again.');
          setJobs([]);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    } else {
      setJobs([]);
      setError('');
    }
  }, [uploadedFile]);

  const handleRemoveCV = () => {
    setUploadedFile(null);
    setError('');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
      } else {
        setError('Only PDF files are allowed.');
      }
    }
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {uploadedFile ? (
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
        ) : (
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

        {loading && <p className="text-center text-gray-600">Loading jobs matched with your CV...</p>}

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {uploadedFile && !loading && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Jobs matched with your CV</h2>

            {jobs.length > 0 ? (
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
                    <div className="text-gray-500 text-sm">{job.work_type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No matching jobs found for your CV.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}