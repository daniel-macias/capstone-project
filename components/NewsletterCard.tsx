import { NewsletterConfig } from '@/lib/types';
import Link from 'next/link';

type Props = {
  newsletter: NewsletterConfig;
};

export default function NewsletterCard({ newsletter }: Props) {
  return (
    <Link
      href={`/edit/${newsletter.id}`}
      className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
    >
      <div>
        <h2 className="text-lg font-semibold mb-1 text-black">{newsletter.name}</h2>
        <p className="text-sm text-gray-600 mb-2 truncate">{newsletter.description || 'No description provided'}</p>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {newsletter.category} • {newsletter.frequency}
      </div>
    </Link>
  );
}