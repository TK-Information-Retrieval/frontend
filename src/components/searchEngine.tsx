import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader } from "lucide-react";
import { getSearchSuggestions } from "@/api/searchApi";
import { SearchResult } from "@/types/types";

interface SearchEngineProps {
	onSearch: (query: string) => void;
	results: SearchResult[];
	isLoading: boolean;
	error: string | null;
}

const SearchEngine: React.FC<SearchEngineProps> = ({ onSearch, results, isLoading, error }) => {
	const [query, setQuery] = useState<string>("");
	const [showResults, setShowResults] = useState<boolean>(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

	useEffect(() => {
		// Focus the search input on component mount
		if (inputRef.current) {
			inputRef.current.focus();
		}

		// Load recent searches from localStorage
		const savedSearches = localStorage.getItem("recentSearches");
		if (savedSearches) {
			setRecentSearches(JSON.parse(savedSearches));
		}
	}, []);

	useEffect(() => {
		// Get search suggestions as user types
		const getSuggestions = async () => {
			if (query.trim().length >= 2) {
				try {
					const suggestionResults = await getSearchSuggestions(query);
					setSuggestions(suggestionResults);
					setShowSuggestions(true);
				} catch (err) {
					console.log(err);
					setSuggestions([]);
				}
			} else {
				setSuggestions([]);
				setShowSuggestions(false);
			}
		};

		const debounceTimer = setTimeout(getSuggestions, 300);
		return () => clearTimeout(debounceTimer);
	}, [query]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		// Save to recent searches
		const updatedRecentSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
		setRecentSearches(updatedRecentSearches);
		localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));

		// Execute search
		setShowSuggestions(false);
		setShowResults(true);
		onSearch(query);
	};

	const clearSearch = () => {
		setQuery("");
		setShowResults(false);
		setShowSuggestions(false);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const handleRecentSearchClick = (search: string) => {
		setQuery(search);
		// Use setTimeout to ensure state updates before search
		setTimeout(() => {
			setShowSuggestions(false);
			setShowResults(true);
			onSearch(search);
		}, 0);
	};

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		setShowSuggestions(false);
		setShowResults(true);

		// Save to recent searches
		const updatedRecentSearches = [suggestion, ...recentSearches.filter((s) => s !== suggestion)].slice(0, 5);
		setRecentSearches(updatedRecentSearches);
		localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));

		onSearch(suggestion);
	};

	return (
		<div className="w-full">
			<div className="relative">
				<form onSubmit={handleSubmit} className="relative">
					<div className="relative flex items-center">
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onFocus={() => query === "" && recentSearches.length > 0 && setShowSuggestions(true)}
							onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
							placeholder="Search for anything..."
							className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none shadow-md text-lg text-black"
						/>
						<div className="absolute left-4">
							<Search className="text-gray-400" size={20} />
						</div>
						{query && (
							<button
								type="button"
								onClick={clearSearch}
								className="absolute right-16 text-gray-400 hover:text-gray-600"
							>
								<X size={18} />
							</button>
						)}
						<button
							type="submit"
							className="absolute right-4 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"
						>
							{isLoading ? <Loader className="animate-spin" size={16} /> : <Search size={16} />}
						</button>
					</div>
				</form>

				{/* Show suggestions or recent searches dropdown */}
				{!showResults && showSuggestions && (
					<div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
						{query === "" && recentSearches.length > 0 ? (
							<>
								<div className="p-2 text-sm text-gray-500">Recent Searches</div>
								<ul>
									{recentSearches.map((search, index) => (
										<li key={index}>
											<button
												onClick={() => handleRecentSearchClick(search)}
												className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
											>
												<Search size={14} className="mr-2 text-gray-400" />
												{search}
											</button>
										</li>
									))}
								</ul>
							</>
						) : suggestions.length > 0 ? (
							<>
								<div className="p-2 text-sm text-gray-500">Suggestions</div>
								<ul>
									{suggestions.map((suggestion, index) => (
										<li key={index}>
											<button
												onClick={() => handleSuggestionClick(suggestion)}
												className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
											>
												<Search size={14} className="mr-2 text-gray-400" />
												{suggestion}
											</button>
										</li>
									))}
								</ul>
							</>
						) : null}
					</div>
				)}
			</div>

			{showResults && (
				<div className="mt-6">
					{isLoading ? (
						<div className="flex justify-center my-12">
							<Loader className="animate-spin text-blue-500" size={36} />
						</div>
					) : error ? (
						<div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">{error}</div>
					) : results.length === 0 ? (
						<div className="text-center my-12 text-gray-500">
							<p className="text-lg">No results found for $`{query}`</p>
							<p className="mt-2">Try different keywords or check your spelling</p>
						</div>
					) : (
						<>
							<p className="text-sm text-gray-500 mb-4">{results.length} results found</p>
							<div className="space-y-6">
								{results.map((result) => (
									<SearchResultItem key={result.id} result={result} />
								))}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

// Component to display individual search results
const SearchResultItem: React.FC<{ result: SearchResult }> = ({ result }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
			<a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
				<div className="flex">
					{result.imageUrl && (
						<div className="mr-4 flex-shrink-0">
							<img
								src={result.imageUrl}
								alt={result.title}
								className="w-24 h-24 object-cover rounded-md"
								onError={(e) => {
									// Replace broken images with placeholder
									(e.target as HTMLImageElement).src = "/api/placeholder/96/96";
								}}
							/>
						</div>
					)}
					<div className="flex-grow">
						<h2 className="text-xl font-semibold text-blue-600 hover:underline">{result.title}</h2>
						<p className="text-green-700 text-sm mt-1">{result.url}</p>
						{result.datePublished && (
							<p className="text-gray-500 text-xs mt-1">
								{new Date(result.datePublished).toLocaleDateString()}
							</p>
						)}
						<p className="text-gray-600 mt-2">{result.description}</p>

						{result.tags && result.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-3">
								{result.tags.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</a>
		</div>
	);
};

export default SearchEngine;
