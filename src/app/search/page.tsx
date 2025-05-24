import { Suspense } from 'react';
import Header from '../../components/Header';
import SearchClient from '../../components/SearchClient';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
