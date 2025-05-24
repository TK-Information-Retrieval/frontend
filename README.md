# SeekCareer - Job Search Platform
A modern job search platform.

## 🔗 Link: [seekcareer.netlify.app](https://seekcareer.netlify.app)
Note: if encounter any errors, please run this on CMD:
```"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\chrome_dev"```<br>
Then, visit again our [link](https://seekcareer.netlify.app) on the new opened tab.

## Features

- **Home Page**: Introduction with search functionality and CV upload
- **Search Page**: Browse and search job postings by keywords
- **CV-based Search**: Upload CV to find matching job opportunities
- **Query Suggestions**: Get suggestions for your query to maximize your search experience
- **Job Details**: Detailed job information with company details and application

## Front-End Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
  
## Pages Overview

### 1. Home Page (`/`)
- Hero section with company branding
- Global search bar for job queries
- CV upload area with drag-and-drop functionality
- Navigation to other sections

### 2. Search Page (`/search`)
Search by Query
- Keyword-based job search
- Grid layout displaying job cards
- Search results filtering
- Direct navigation to job details

Search by CV
- File upload interface for CV/resume
- AI-powered job matching simulation
- Personalized job recommendations

### 4. Job Detail Page (`/job/[id]`)
- Comprehensive job information
- Company details and benefits
- Contact information
