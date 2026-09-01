import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen py-20 bg-cream-100 flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-sand-200 space-y-6 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-sage-100 text-forest-900 mx-auto flex items-center justify-center">
          <Leaf className="w-8 h-8 text-forest-700" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest-950">404 - Lost in Nature</h1>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            The page or botanical remedy you are looking for does not exist or may have moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 font-bold px-6 py-3 rounded-xl text-xs hover:bg-forest-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
