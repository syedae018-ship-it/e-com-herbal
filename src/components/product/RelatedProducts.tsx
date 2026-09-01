import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '../shop/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="pt-16 sm:pt-20 border-t border-sand-200">
      <div className="space-y-8">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Complementary Care
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
