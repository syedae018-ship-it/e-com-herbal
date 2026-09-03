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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-zinc-200/80 p-3 space-y-3 animate-pulse h-[310px] flex flex-col justify-between"
          >
            <div className="aspect-[16/10.5] bg-zinc-100 rounded-lg w-full" />
            <div className="space-y-2">
              <div className="h-2.5 bg-zinc-100 rounded w-1/4" />
              <div className="h-3.5 bg-zinc-200 rounded w-3/4" />
              <div className="h-2.5 bg-zinc-100 rounded w-full" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
              <div className="h-4 bg-zinc-200 rounded w-16" />
              <div className="h-7 bg-zinc-200 rounded w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200/80 p-10 text-center max-w-md mx-auto space-y-3 shadow-xs font-admin-body">
        <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-800 mx-auto flex items-center justify-center">
          <Leaf className="w-6 h-6 text-forest-700" />
        </div>
        <h3 className="font-admin-heading text-base font-semibold text-zinc-950">{emptyTitle}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">{emptyMessage}</p>
        <Link
          href="/shop"
          className="inline-block mt-2 bg-forest-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-forest-800 transition-colors shadow-xs"
        >
          Reset All Filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-5 items-stretch">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
