'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { NewsletterConfig } from '@/lib/types';
import NewsletterForm from '@/components/NewsletterForm';
import { ClipLoader } from 'react-spinners';

export default function EditNewsletterPage() {
	const { id } = useParams();
	const [initialData, setInitialData] = useState<NewsletterConfig | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchNewsletter = async () => {
			try {
				const res = await fetch('/api/newsletters');
				const data: NewsletterConfig[] = await res.json();
				const match = data.find((nl) => nl.id === id);
				if (match) setInitialData(match);
			} catch (err) {
				console.error('Error loading newsletter:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchNewsletter();
	}, [id]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<ClipLoader size={50} color="#3b82f6" />
			</div>
		);
	}

	if (!initialData) {
		return <p className="p-4 text-red-500">Newsletter not found.</p>;
	}

	return (
		<div className="flex-1 py-8 px-4">
			<div className="max-w-6xl mx-auto bg-white p-6">
				<h1 className="text-2xl font-light mb-6 text-center text-black">Edit Newsletter</h1>
				<NewsletterForm initialValues={initialData} />
			</div>
		</div>
	);
}
