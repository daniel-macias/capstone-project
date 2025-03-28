'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">NewsGen</Link>
        <div className="space-x-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/create" className="hover:underline">Create</Link>
        </div>
      </div>
    </nav>
  )
}
