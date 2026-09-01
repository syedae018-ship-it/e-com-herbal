'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatINR, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();
  const discount = calculateDiscount(product.price, product.original_price);
  
  const inCart = items.some((item) => item.product.id === product.id);
  const imageUrl =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

  const categoryName = product.category?.name || 'Organic Care';

  return (
    <div className="group relative bg-white rounded-2xl border border-sand-200/90 overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 flex flex-col h-full">
      {/* Image Container & Discount Badge */}
      <div className="relative aspect-square w-full overflow-hidden bg-sand-50">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-amber-600 text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            {discount}% OFF
          </div>
        )}

        {/* Stock Status Badge */}
        {product.stock <= 0 ? (
          <div className="absolute top-3 right-3 bg-rose-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full">
            Out of Stock
          </div>
        ) : product.stock < 10 ? (
          <div className="absolute top-3 right-3 bg-amber-500/90 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </div>
        ) : null}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category Tag */}
          <span className="text-[11px] font-semibold tracking-wider uppercase text-sage-600">
            {categoryName}
          </span>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Subtitle */}
          <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-sand-100">
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-1 text-charcoal-900">{product.rating || 4.9}</span>
            </div>
            <span className="text-charcoal-400">•</span>
            <span className="text-charcoal-500 text-[11px]">
              ({product.review_count || 48} reviews)
            </span>
          </div>

          {/* Pricing & Add to Cart Button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold text-forest-950 font-sans">
                  {formatINR(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xs text-charcoal-400 line-through">
                    {formatINR(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => addItem(product, 1)}
              disabled={product.stock <= 0}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 shadow-sm active:scale-95 ${
                inCart
                  ? 'bg-sage-100 text-forest-900 hover:bg-sage-200'
                  : 'bg-forest-900 text-cream-50 hover:bg-forest-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`Add ${product.name} to cart`}
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest-700" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
