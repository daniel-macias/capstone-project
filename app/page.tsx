'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NewsletterConfig } from '@/lib/types';
import NewsletterCard from '@/components/NewsletterCard';
import { ClipLoader } from 'react-spinners';
import { Plus } from 'lucide-react';

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

				const stillGenerating = data.some((nl: NewsletterConfig) => nl.status === 'generating');

				if (stillGenerating) {
					if (!interval) {
						interval = setInterval(fetchNewsletters, 12000);
						console.log("Checking if newsletters have generated");
					}
				} else {
					if (interval) {
						clearInterval(interval);
					}
				}
			} catch (error) {
				console.error('Failed to fetch newsletters:', error);
			} finally {
				setLoading(false);
				console.log("Every newsletter has generated");
			}
		};

		fetchNewsletters();

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			{loading ? (
				<div className="flex justify-center items-center h-[70vh]">
					<ClipLoader color="#3b82f6" size={60} /> {/* Azul bonito y tamaño grande */}
				</div>
			) : (
				<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{/* Create Card */}
          <Link
            href="/create"
            className="group bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition relative overflow-hidden"
          >
            <Plus className="text-blue-600 w-10 h-10 transition-transform group-hover:-translate-y-2" />
            <span className="absolute opacity-0 group-hover:opacity-100 group-hover:translate-y-6 transition-all text-xl font-light text-blue-600 mt-2">
              Create Newsletter
            </span>
          </Link>


					{/* Existing Newsletters */}
					{newsletters.map((nl) => (
						<NewsletterCard key={nl.id} newsletter={nl} />
					))}
				</div>
			)}
		</div>
	);
}
