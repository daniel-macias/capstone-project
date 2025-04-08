'use client';

import { NewsletterConfig } from '@/lib/types';
import Link from 'next/link';
import { BounceLoader } from 'react-spinners';
import { useEffect, useState } from 'react';

type Props = {
	newsletter: NewsletterConfig;
};

export default function NewsletterCard({ newsletter }: Props) {
	const [dots, setDots] = useState('');

	useEffect(() => {
		if (newsletter.status === 'generating') {
			const interval = setInterval(() => {
				setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
			}, 500);
			return () => clearInterval(interval);
		}
	}, [newsletter.status]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-gray-400';
			case 'generating':
				return 'bg-blue-400';
			case 'ready':
				return 'bg-green-500';
			default:
				return 'bg-gray-300';
		}
	};

	return (
		<Link
			href={`/edit/${newsletter.id}`}
			className="bg-white shadow rounded-lg p-4 border border-gray-300 hover:shadow-lg transition flex flex-col justify-between"
		>
			<div>
				<h2 className="text-lg font-semibold mb-1 text-black">{newsletter.name}</h2>
				<p className="text-sm text-gray-600 mb-2 truncate">
					{newsletter.description || 'No description provided'}
				</p>
				<div className="text-xs text-gray-500 flex items-center gap-2">
					<span>{newsletter.category} • {newsletter.frequency}</span>
				</div>
			</div>

			{newsletter.status && (
				<div className="text-xs text-gray-500 mt-4 flex items-center gap-2">
					{newsletter.status === 'generating' ? (
						<BounceLoader color="#3b82f6" size={12} />
					) : (
						<span className={`w-2 h-2 rounded-full ${getStatusColor(newsletter.status)}`} />
					)}
					<span>
						{newsletter.status === 'generating' ? `generating${dots}` : newsletter.status}
					</span>
				</div>
			)}
		</Link>
	);
}
