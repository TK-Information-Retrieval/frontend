import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { SearchParams } from "../types/types";

interface SearchFiltersProps {
	onApplyFilters: (filters: SearchParams["filters"], sort: SearchParams["sort"]) => void;
	initialFilters?: SearchParams["filters"];
	initialSort?: SearchParams["sort"];
	availableTags?: string[];
	availableSources?: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
	onApplyFilters,
	initialFilters,
	initialSort = "relevance",
	availableTags = [],
	availableSources = [],
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [sort, setSort] = useState<SearchParams["sort"]>(initialSort);

	const [dateFrom, setDateFrom] = useState(initialFilters?.dateRange?.from || "");
	const [dateTo, setDateTo] = useState(initialFilters?.dateRange?.to || "");
	const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);
	const [selectedSources, setSelectedSources] = useState<string[]>(initialFilters?.sources || []);

	const handleApplyFilters = () => {
		// Prepare date range if dates are set
		const dateRange =
			dateFrom || dateTo
				? {
						from: dateFrom || undefined,
						to: dateTo || undefined,
				  }
				: undefined;

		// Update filters state
		const updatedFilters: SearchParams["filters"] = {
			dateRange,
			tags: selectedTags.length > 0 ? selectedTags : undefined,
			sources: selectedSources.length > 0 ? selectedSources : undefined,
		};

		onApplyFilters(updatedFilters, sort);
	};

	const handleResetFilters = () => {
		setDateFrom("");
		setDateTo("");
		setSelectedTags([]);
		setSelectedSources([]);
		setSort("relevance");

		onApplyFilters({}, "relevance");
	};

	const toggleTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t !== tag));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const toggleSource = (source: string) => {
		if (selectedSources.includes(source)) {
			setSelectedSources(selectedSources.filter((s) => s !== source));
		} else {
			setSelectedSources([...selectedSources, source]);
		}
	};

	// Calculate if any filters are active
	const hasActiveFilters =
		Boolean(dateFrom) ||
		Boolean(dateTo) ||
		selectedTags.length > 0 ||
		selectedSources.length > 0 ||
		sort !== "relevance";

	return (
		<div className="mb-6 mt-2">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 bg-gray-100 rounded-lg"
			>
				<Filter size={16} className="mr-2" />
				<span>Filters</span>
				{hasActiveFilters && (
					<span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">Active</span>
				)}
				{isOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
			</button>

			{isOpen && (
				<div className="mt-3 p-4 border border-gray-200 rounded-lg bg-white shadow-md">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Date Range Filter */}
						<div>
							<h3 className="font-medium mb-2">Date Range</h3>
							<div className="flex flex-col space-y-2">
								<div>
									<label className="block text-sm text-gray-600 mb-1">From</label>
									<input
										type="date"
										value={dateFrom}
										onChange={(e) => setDateFrom(e.target.value)}
										className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600 mb-1">To</label>
									<input
										type="date"
										value={dateTo}
										onChange={(e) => setDateTo(e.target.value)}
										className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
									/>
								</div>
							</div>
						</div>

						{/* Tags Filter */}
						<div>
							<h3 className="font-medium mb-2">Tags</h3>
							<div className="max-h-40 overflow-y-auto">
								{availableTags.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{availableTags.map((tag) => (
											<button
												key={tag}
												onClick={() => toggleTag(tag)}
												className={`px-2 py-1 text-xs rounded-full ${
													selectedTags.includes(tag)
														? "bg-blue-500 text-white"
														: "bg-gray-100 text-gray-700 hover:bg-gray-200"
												}`}
											>
												{tag}
											</button>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500">No tags available</p>
								)}
							</div>
						</div>

						{/* Sources Filter */}
						<div>
							<h3 className="font-medium mb-2">Sources</h3>
							<div className="max-h-40 overflow-y-auto">
								{availableSources.length > 0 ? (
									<div className="space-y-1">
										{availableSources.map((source) => (
											<label key={source} className="flex items-center text-sm cursor-pointer">
												<input
													type="checkbox"
													checked={selectedSources.includes(source)}
													onChange={() => toggleSource(source)}
													className="mr-2"
												/>
												{source}
											</label>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500">No sources available</p>
								)}
							</div>
						</div>
					</div>

					{/* Sort Options */}
					<div className="mt-4 pt-4 border-t border-gray-200">
						<h3 className="font-medium mb-2">Sort By</h3>
						<div className="flex space-x-4">
							<label className="flex items-center text-sm cursor-pointer">
								<input
									type="radio"
									name="sort"
									value="relevance"
									checked={sort === "relevance"}
									onChange={() => setSort("relevance")}
									className="mr-2"
								/>
								Relevance
							</label>
							<label className="flex items-center text-sm cursor-pointer">
								<input
									type="radio"
									name="sort"
									value="date"
									checked={sort === "date"}
									onChange={() => setSort("date")}
									className="mr-2"
								/>
								Date (Newest)
							</label>
							<label className="flex items-center text-sm cursor-pointer">
								<input
									type="radio"
									name="sort"
									value="popularity"
									checked={sort === "popularity"}
									onChange={() => setSort("popularity")}
									className="mr-2"
								/>
								Popularity
							</label>
						</div>
					</div>

					{/* Actions */}
					<div className="mt-6 flex justify-end space-x-3">
						<button
							onClick={handleResetFilters}
							className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center"
							disabled={!hasActiveFilters}
						>
							<X size={14} className="mr-1" />
							Reset
						</button>
						<button
							onClick={handleApplyFilters}
							className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
						>
							Apply Filters
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchFilters;
