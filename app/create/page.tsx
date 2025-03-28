'use client';

import NewsletterForm from '@/components/NewsletterForm';

export default function CreateNewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Create a New Newsletter</h1>
        <NewsletterForm />
      </div>
    </div>
  );
}
