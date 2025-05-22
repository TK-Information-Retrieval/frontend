import { SearchResult, SearchResponse, SearchParams } from "../types/types";

// Base URL for your search API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.yoursearchengine.com";

/**
 * Executes a search with the given query and parameters
 * @param query Search query string
 * @param params Additional search parameters
 * @returns Promise with search results
 */
export async function searchAPI(query: string, params: Omit<SearchParams, "query"> = {}): Promise<SearchResult[]> {
	try {
		// Build query parameters
		const queryParams = new URLSearchParams();
		queryParams.append("query", query);

		if (params.page) {
			queryParams.append("page", params.page.toString());
		}

		if (params.pageSize) {
			queryParams.append("pageSize", params.pageSize.toString());
		}

		if (params.sort) {
			queryParams.append("sort", params.sort);
		}

		// Add filters if present
		if (params.filters) {
			if (params.filters.dateRange?.from) {
				queryParams.append("dateFrom", params.filters.dateRange.from);
			}

			if (params.filters.dateRange?.to) {
				queryParams.append("dateTo", params.filters.dateRange.to);
			}

			if (params.filters.tags && params.filters.tags.length > 0) {
				params.filters.tags.forEach((tag) => {
					queryParams.append("tag", tag);
				});
			}

			if (params.filters.sources && params.filters.sources.length > 0) {
				params.filters.sources.forEach((source) => {
					queryParams.append("source", source);
				});
			}
		}

		// Make the API request
		const response = await fetch(`${API_BASE_URL}/search?${queryParams.toString()}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				// Add any authentication headers if needed
				// 'Authorization': `Bearer ${token}`
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(errorData?.message || `Search request failed with status: ${response.status}`);
		}

		const data: SearchResponse = await response.json();
		return data.results;
	} catch (error) {
		console.error("Search API error:", error);
		throw error;
	}
}

/**
 * Get search suggestions as user types
 * @param query Partial query string
 * @returns Promise with suggested search terms
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
	if (!query || query.trim().length < 2) {
		return [];
	}

	try {
		const response = await fetch(`${API_BASE_URL}/suggestions?query=${encodeURIComponent(query)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Suggestions request failed with status: ${response.status}`);
		}

		const data = await response.json();
		return data.suggestions || [];
	} catch (error) {
		console.error("Suggestions API error:", error);
		return [];
	}
}
