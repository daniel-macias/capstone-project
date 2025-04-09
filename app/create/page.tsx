'use client';

import NewsletterForm from '@/components/NewsletterForm';

export default function CreateNewsletterPage() {
  return (
    <div className="flex-1 py-8 px-4">
      <div className="">
        <h1 className="text-2xl font-light mb-6 text-center text-black">Create a New Newsletter</h1>
        <NewsletterForm />
      </div>
    </div>
  );
}
