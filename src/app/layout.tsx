import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FileProvider } from '../lib/FileContext';
import Header from '@/components/Header'
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SeekCareer - Find Your Dream Job',
  description: 'Search for job opportunities and find your perfect career match with AI-powered job recommendations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Header/>
      <body>
        <FileProvider>{children}</FileProvider>
      </body>
      <Footer/>
    </html>
  )
}