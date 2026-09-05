'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

interface CategoryCardsProps {
  categories: Category[];
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ categories }) => {
  const { content } = useWebsiteContent();
  const section = content.categories_section;

  if (section.is_enabled === false) {
    return null;
  }

  return (
    <section id="categories" className="py-16 sm:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {section.badge_text && (
            <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
              {section.badge_text}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            {section.heading}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            {section.subtitle}
          </p>
        </div>


        {/* Category Grid: 2-col on mobile, 3-col on tablet, 5-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
                <Image
                  src={
                    category.image_url ||
                    '/images/fallback.svg'
                  }
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Body */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <h3 className="font-serif text-xs sm:text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-charcoal-500 line-clamp-2 leading-relaxed hidden xs:block">
                    {category.description}
                  </p>
                </div>

                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center justify-between w-full pt-2 sm:pt-3 border-t border-sand-100 text-[10px] sm:text-xs font-bold text-forest-900 group-hover:text-forest-700 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
