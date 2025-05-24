# SeekCareer - Job Search Platform

A modern job search platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Home Page**: Introduction with search functionality and CV upload
- **Search Page**: Browse and search job postings by keywords
- **CV-based Search**: Upload CV to find matching job opportunities
- **Job Details**: Detailed job information with company details and application

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd seekcareer-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── JobCard.tsx     # Job listing card component
│   └── FileUpload.tsx  # File upload component
├── data/               # Mock data and constants
│   └── jobs.ts         # Sample job data
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── index.tsx       # Home page
│   ├── search.tsx      # Job search page
│   ├── search-cv.tsx   # CV-based search page
│   └── job/
│       └── [id].tsx    # Dynamic job detail page
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS imports
└── types/              # TypeScript type definitions
    └── job.ts          # Job interface
```

## Pages Overview

### 1. Home Page (`/`)
- Hero section with company branding
- Global search bar for job queries
- CV upload area with drag-and-drop functionality
- Navigation to other sections

### 2. Search Page (`/search`)
- Keyword-based job search
- Grid layout displaying job cards
- Search results filtering
- Direct navigation to job details

### 3. CV Search Page (`/search-cv`)
- File upload interface for CV/resume
- AI-powered job matching simulation
- Personalized job recommendations
- Upload status and file management

### 4. Job Detail Page (`/job/[id]`)
- Comprehensive job information
- Company details and benefits
- Contact information
- Apply now functionality

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```