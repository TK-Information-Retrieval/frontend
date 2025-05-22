// Type definitions for the search engine

export interface SearchResult {
	id: string;
	title: string;
	url: string;
	description: string;
	tags?: string[];
	datePublished?: string;
	imageUrl?: string;
	source?: string;
	relevanceScore?: number;
}

export interface SearchResponse {
	results: SearchResult[];
	totalResults: number;
	page: number;
	pageSize: number;
	searchTime: number;
	query: string;
}

export interface SearchParams {
	query: string;
	page?: number;
	pageSize?: number;
	filters?: {
		dateRange?: {
			from?: string;
			to?: string;
		};
		tags?: string[];
		sources?: string[];
	};
	sort?: "relevance" | "date" | "popularity";
}
