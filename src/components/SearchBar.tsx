'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for jobs..."
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-pink-400 hover:text-pink-600"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
