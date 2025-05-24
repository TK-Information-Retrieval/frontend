'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, DollarSign, Calendar, Users, Building, ArrowLeft } from 'lucide-react';
import { JobDetail } from '@/types';

function getCompanySizeRange(size: number): string {
  if (size < 50) return '1-50';
  if (size < 250) return '51-250';
  if (size < 1000) return '251-1000';
  return '1000+';
}

function processSkills(skillsString: string): string[] {
  if (!skillsString) return [];
  
  // Split by capital letters, keeping the capital letter with the word
  const skills = skillsString.split(/(?=[A-Z])/).filter(skill => skill.trim().length > 0);
  
  // Clean up each skill - trim whitespace and ensure proper capitalization
  return skills.map(skill => skill.trim()).filter(skill => skill.length > 0);
}

const mockJobDetails: { [key: string]: JobDetail } = {
  '1': {
    "job_id": "1041276767356708",
    "experience": "2 to 10 Years",
    "qualifications": "B.Tech",
    "salary_range": "$60K-$89K",
    "location": "Dushanbe",
    "country": "Tajikistan",
    "latitude": 38.861,
    "longitude": 71.2761,
    "work_type": "Contract",
    "company_size": 53817,
    "job_posting_date": "2021-10-24",
    "preference": "Female",
    "contact_person": "Jeff Sharp",
    "contact": "763-546-3525x210",
    "job_title": "Structural Engineer",
    "role": "Design Engineer",
    "job_portal": "Snagajob",
    "job_description": "A Design Engineer creates and develops product designs and specifications, using engineering principles and design software to bring innovative products to market.",
    "benefits": ["Employee Referral Programs", "Financial Counseling", "Health and Wellness Facilities", "Casual Dress Code", "Flexible Spending Accounts (FSAs)"],
    "skills": "Engineering design",
    "responsibilities": ["Design structural systems and components for buildings and infrastructure projects", "Perform structural analysis and calculations", "Create detailed design plans and specifications."],
    "company": "Microsoft",
    "company_profile": {
        "CEO": "Satya Nadella",
        "Zip": "98052",
        "City": "Redmond",
        "State": "Washington",
        "Sector": "Technology",
        "Ticker": "MSFT",
        "Website": "www.microsoft.com",
        "Industry": "Computer Software"
    }
  }
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_JOB_API_BASE_URL || '';

  useEffect(() => {
    const jobId = params?.id as string;
    if (!jobId) return;

    const fetchJobDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch job details: ${response.status}`);
        }

        const jobData = await response.json();
        
        // Process the API response to match our JobDetail type
        const processedJob: JobDetail = {
          ...jobData,
          // Process skills string into array
          skills: jobData.skills || []
        };

        setJob(processedJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
        
        // Fallback to mock data
        const jobDetail = mockJobDetails[jobId] || mockJobDetails['1'];
        setJob(jobDetail);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [params?.id, API_BASE_URL]);

  const handleBack = () => {
    router.back();
  };

  const handleApply = () => {
    alert('Application submitted successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            {error || 'Job not found'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-4xl mx-auto mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} Showing cached data instead.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to search
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
              <p className="text-xl text-gray-600 mb-4">{job.company}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}, {job.country}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{job.salary_range} / year</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{job.work_type}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{getCompanySizeRange(job.company_size)} employees</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{job.role}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleApply}
              className="px-8 py-3 bg-pink-400 text-white rounded-lg font-medium hover:bg-pink-500 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.job_description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Qualifications: {job.qualifications}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Experience: {job.experience}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Preference: {job.preference}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Skills: {job.skills}</span>
                </li>
              </ul>              
            </div>   
            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit.replace(/'/g, '')}</span>
                  </li>
                ))}
              </ul>
            </div>         
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-900">{job.company}</p>
                </div>
                {job.company_profile?.Industry && (
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">{job.company_profile.Industry}</p>
                  </div>
                )}
                {job.company_profile?.Sector && (
                  <div>
                    <p className="text-sm text-gray-500">Sector</p>
                    <p className="font-medium text-gray-900">{job.company_profile.Sector}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Posted Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(job.job_posting_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {job.company_profile?.Website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={`https://${job.company_profile.Website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {job.company_profile.Website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {job.contact_person && (
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium text-gray-900">{job.contact_person}</p>
                  </div>
                )}
                {job.contact && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{job.contact}</p>
                  </div>
                )}
                {job.job_portal && (
                  <div>
                    <p className="text-sm text-gray-500">Job Portal</p>
                    <p className="font-medium text-gray-900">{job.job_portal}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button (Mobile) */}
            <div className="lg:hidden">
              <button
                onClick={handleApply}
                className="w-full px-8 py-3 bg-pink-400 text-white rounded-lg font-medium hover:bg-pink-500 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}