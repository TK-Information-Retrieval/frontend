import React from "react";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<h1 className="text-3xl font-bold text-center text-gray-800">Search Engine</h1>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

			<footer className="mt-12 text-center text-gray-500 text-sm">
				<p>© {new Date().getFullYear()} Your Search Engine. All rights reserved.</p>
			</footer>
		</div>
	);
}
