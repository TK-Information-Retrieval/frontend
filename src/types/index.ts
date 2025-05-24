export interface JobListing {
	job_id: string,
	job_title: string,
	company: string,
	location: string,
	country: string,
	salary_range: string,
	work_type: string
}

export interface JobDetail extends JobListing {
	job_id: string,
	experience: string,
	qualifications: string,
	salary_range: string,
	location: string,
	country: string,
	latitude: number,
	longitude: number,
	work_type: string,
	company_size: number,
	job_posting_date: string,
	preference: string,
	contact_person: string,
	contact: string,
	job_title: string,
	role: string,
	job_portal: string,
	job_description: string,
	benefits: string[],
	skills: string,
	responsibilities: string[],
	company: string,
	company_profile: {
		CEO: string,
		Zip: string,
		City: string,
		State: string,
		Sector: string,
		Ticker: string,
		Website: string,
		Industry: string
	}
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