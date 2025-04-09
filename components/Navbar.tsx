'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-zinc-700 shadow-sm dark:shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-light text-blue-600 dark:text-gray-50"
        >
          Newsletter Generator
        </Link>
        <div className="space-x-6 text-sm text-gray-800 dark:text-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/create" className="hover:underline">
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
}
