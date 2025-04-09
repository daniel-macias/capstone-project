'use client';

import NewsletterForm from '@/components/NewsletterForm';

export default function CreateNewsletterPage() {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-background py-8 px-4">
      <div>
        <h1 className="text-2xl font-light mb-6 text-center text-black dark:text-foreground">
          Create a New Newsletter
        </h1>
        <NewsletterForm />
      </div>
    </div>
  );
}
