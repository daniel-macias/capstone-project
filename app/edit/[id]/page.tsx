'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { NewsletterConfig } from '@/lib/types';
import NewsletterForm from '@/components/NewsletterForm';

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

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!initialData) return <p className="p-4 text-red-500">Newsletter not found.</p>;

  return (
    <div className="flex-1  py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white  p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Edit Newsletter</h1>
        <NewsletterForm initialValues={initialData} />
      </div>
    </div>
  );
}