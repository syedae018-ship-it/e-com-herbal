'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductCard } from '../shop/ProductCard';
import { ArrowRight } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

interface BestsellersProps {
  products: Product[];
}

export const Bestsellers: React.FC<BestsellersProps> = ({ products }) => {
  const { content } = useWebsiteContent();
  const section = content.bestsellers_section;

  if (section.is_enabled === false) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            {section.badge_text && (
              <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
                {section.badge_text}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
              {section.heading}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl">
              {section.subtitle}
            </p>
          </div>

          <Link
            href={section.button_link || '/shop'}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest-900 hover:text-forest-700 transition-colors group"
          >
            <span>{section.button_text || 'View All Bestsellers'}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

