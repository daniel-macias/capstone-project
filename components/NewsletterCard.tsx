import { NewsletterConfig } from '@/lib/types';
import Link from 'next/link';

type Props = {
	newsletter: NewsletterConfig;
};

export default function NewsletterCard({ newsletter }: Props) {
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

			{/* Status in its own line */}
			{newsletter.status && (
				<div className="text-xs text-gray-500 mt-4 flex items-center gap-2">
					<span className={`w-2 h-2 rounded-full ${getStatusColor(newsletter.status)}`} />
					<span>{newsletter.status}</span>
				</div>
			)}
		</Link>
	);
}
