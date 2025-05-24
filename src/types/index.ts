export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type?: string;
  postedDate?: string;
  description?: string;
}

export interface JobDetail extends JobListing {
  requirements: string[];
  benefits: string[];
  companySize: string;
  industry: string;
  description: string;
  postedDate: string;
}

export interface SearchFilters {
  location?: string;
  salaryRange?: string;
  jobType?: string;
  experience?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cvUploaded?: boolean;
  cvFileName?: string;
}

export interface SearchParams {
  q?: string;
  location?: string;
  type?: string;
  salary?: string;
}

export interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface JobSearchResponse {
  jobs: JobListing[];
  total: number;
  page: number;
  limit: number;
}

export interface CVMatchResponse {
  matchedJobs: JobListing[];
  matchScore: number;
  recommendations: string[];
}