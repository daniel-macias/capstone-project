'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NewsletterConfig } from '@/lib/types';
import NewsletterCard from '@/components/NewsletterCard';

export default function HomePage() {
	const [newsletters, setNewsletters] = useState<NewsletterConfig[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		const fetchNewsletters = async () => {
			try {
				const res = await fetch('/api/newsletters');
				const data = await res.json();
				setNewsletters(data);

				// Check if any newsletter is still generating
				const stillGenerating = data.some((nl: NewsletterConfig) => nl.status === 'generating');

				if (stillGenerating) {
					// Poll again after 5 seconds
					if (!interval) {
						interval = setInterval(fetchNewsletters, 12000);
            console.log("Checking if newsletters have generated")
					}
				} else {
					// If all are ready, stop polling
					if (interval) {
						clearInterval(interval);
					}
				}
			} catch (error) {
				console.error('Failed to fetch newsletters:', error);
			} finally {
				setLoading(false);
        console.log("Every newsletter has generated")
			}
		};

		fetchNewsletters();

		return () => {
			// Cleanup interval when component unmounts
			if (interval) {
				clearInterval(interval);
			}
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{/* Create Card */}
				<Link
					href="/create"
					className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center text-center border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition"
				>
					<span className="text-lg font-medium text-blue-600">+ Create Newsletter</span>
				</Link>

				{/* Existing Newsletters */}
				{loading ? (
					<p className="text-gray-500 col-span-full">Loading newsletters...</p>
				) : (
					newsletters.map((nl) => <NewsletterCard key={nl.id} newsletter={nl} />)
				)}
			</div>
		</div>
	);
}
