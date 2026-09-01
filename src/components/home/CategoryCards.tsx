import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardsProps {
  categories: Category[];
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ categories }) => {
  return (
    <section id="categories" className="py-16 sm:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Curated Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Explore pure, plant-powered solutions tailored for every aspect of your daily wellness ritual.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
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
                    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center justify-between w-full pt-3 border-t border-sand-100 text-xs font-bold text-forest-900 group-hover:text-forest-700 transition-colors"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
