"use client";

import React, { useState } from "react";
import SearchEngine from "@/components/searchEngine";
import SearchFilters from "@/components/searchFilters";
import { SearchParams, SearchResult } from "@/types/types";
import { searchAPI } from "@/api/searchApi";

export default function SearchPage() {
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [currentQuery, setCurrentQuery] = useState<string>("");
	const [filters, setFilters] = useState<SearchParams["filters"]>({});
	const [sort, setSort] = useState<SearchParams["sort"]>("relevance");

	// Sample available tags and sources - in a real app, these might come from your API
	const availableTags = ["Technology", "Science", "News", "Entertainment", "Sports", "Health", "Business"];
	const availableSources = ["Blog", "Website", "Academic", "News", "Social Media"];

	// Perform search with current query and filters
	const performSearch = async (query: string) => {
		if (!query.trim()) {
			setResults([]);
			setCurrentQuery("");
			return;
		}

		setIsLoading(true);
		setError(null);
		setCurrentQuery(query);

		try {
			const searchResults = await searchAPI(query, {
				filters,
				sort,
				page: 1,
				pageSize: 20,
			});

			setResults(searchResults);
		} catch (error: unknown) {
			console.error("Search error:", error);
			setError("Failed to fetch search results. Please try again.");
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle filter changes
	const handleFiltersChange = (newFilters: SearchParams["filters"], newSort: SearchParams["sort"]) => {
		setFilters(newFilters);
		setSort(newSort);

		// If we already have a query, re-run the search with new filters
		if (currentQuery) {
			performSearch(currentQuery);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-md p-6">
			{/* Search Component */}
			<SearchEngine onSearch={performSearch} isLoading={isLoading} results={results} error={error} />

			{/* Only show filters when we have a query */}
			{currentQuery && (
				<SearchFilters
					onApplyFilters={handleFiltersChange}
					initialFilters={filters}
					initialSort={sort}
					availableTags={availableTags}
					availableSources={availableSources}
				/>
			)}
		</div>
	);
}
