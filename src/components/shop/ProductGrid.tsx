import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = 'No products found',
  emptyMessage = 'We could not find any organic products matching your selected filters.',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-sand-200 p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-square bg-sand-100 rounded-xl w-full" />
            <div className="h-3 bg-sand-100 rounded w-1/3" />
            <div className="h-4 bg-sand-200 rounded w-3/4" />
            <div className="h-3 bg-sand-100 rounded w-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-sand-200 rounded w-16" />
              <div className="h-8 bg-sand-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sand-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-sage-50 text-forest-800 mx-auto flex items-center justify-center">
          <Leaf className="w-8 h-8 text-forest-700" />
        </div>
        <h3 className="font-serif text-lg font-bold text-forest-950">{emptyTitle}</h3>
        <p className="text-xs text-charcoal-600 leading-relaxed">{emptyMessage}</p>
        <Link
          href="/shop"
          className="inline-block mt-2 bg-forest-900 text-cream-50 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-forest-800 transition-colors"
        >
          View All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
