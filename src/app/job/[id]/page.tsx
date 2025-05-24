'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, DollarSign, Calendar, Users, Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
  companySize: string;
  industry: string;
}

const mockJobDetails: { [key: string]: JobDetail } = {
  '1': {
    id: '1',
    title: 'Web Developer',
    company: 'PT Awan Hujan',
    location: 'Jakarta Selatan',
    salary: '8M-10M/month',
    type: 'Full-time',
    postedDate: '2024-05-20',
    description: 'We are looking for a skilled Web Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies and frameworks.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '2+ years of experience in web development',
      'Proficiency in HTML, CSS, JavaScript',
      'Experience with React.js or Vue.js',
      'Knowledge of Node.js and Express.js',
      'Familiarity with database systems (MySQL, MongoDB)',
      'Understanding of version control systems (Git)'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Flexible working hours',
      'Professional development opportunities',
      'Team building activities',
      'Modern office environment'
    ],
    companySize: '50-100 employees',
    industry: 'Technology'
  }
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobId = params?.id as string;
    // Simulate API call
    setTimeout(() => {
      const jobDetail = mockJobDetails[jobId] || mockJobDetails['1'];
      setJob(jobDetail);
      setLoading(false);
    }, 500);
  }, [params?.id]);

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
          <p className="text-gray-500 text-lg mb-4">Job not found</p>
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <h1 className="text-xl font-semibold text-gray-900">SeekCareer</h1>
              </Link>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{job.company}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{job.companySize}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{job.industry}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-900">{job.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium text-gray-900">{job.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-medium text-gray-900">{job.companySize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(job.postedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
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