import { Suspense } from 'react';
import SearchClient from '../../components/SearchClient';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
