'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Newsletter Generator
        </Link>
        <div className="space-x-6 text-sm text-gray-800">
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
