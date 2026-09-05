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
    '/images/fallback.svg';

  const categoryName = product.category?.name || 'Organic Care';

  return (
    <div className="group relative bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-card transition-all duration-200 flex flex-col h-full overflow-hidden font-admin-body select-none">
      {/* 2. Product Image Area */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden bg-[#faf9f6] shrink-0">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Compact Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-amber-600 text-white font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded shadow-xs tracking-tight">
            {discount}% OFF
          </span>
        )}

        {/* Stock Status Badge */}
        {product.stock <= 0 ? (
          <span className="absolute top-2 right-2 bg-zinc-900/85 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-medium">
            Out of stock
          </span>
        ) : product.stock < 10 ? (
          <span className="absolute top-2 right-2 bg-amber-700/85 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-medium">
            {product.stock} left
          </span>
        ) : null}
      </div>

      {/* 3. Product Information Area */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
        <div className="space-y-0.5 sm:space-y-1">
          {/* Category */}
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block truncate leading-tight">
            {categoryName}
          </span>

          {/* Product Title (Max 2 lines) */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-admin-heading text-xs sm:text-[13px] font-bold text-zinc-900 group-hover:text-forest-900 transition-colors line-clamp-2 leading-snug min-h-[30px] sm:min-h-[34px]">
              {product.name}
            </h3>
          </Link>

          {/* Short Description (Max 2 lines, subtle on mobile) */}
          <p className="text-[10px] sm:text-[11px] text-zinc-500 line-clamp-2 leading-relaxed hidden xs:block">
            {product.short_description}
          </p>
        </div>

        {/* Bottom Section: Rating + Price & Add CTA */}
        <div className="space-y-1.5 sm:space-y-2 pt-1.5 sm:pt-2 border-t border-zinc-100 mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold ml-0.5 text-zinc-800">{product.rating || 4.9}</span>
            </div>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-400 truncate">({product.review_count || 48})</span>
          </div>

          {/* Pricing & Add to Cart Row */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 pt-0.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 min-w-0">
              <span className="font-admin-heading text-xs sm:text-sm md:text-base font-bold text-zinc-950 tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-[9px] sm:text-[10px] text-zinc-400 line-through tabular-nums truncate">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => addItem(product, 1)}
              disabled={product.stock <= 0}
              className={`h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1 transition-all duration-150 active:scale-95 shrink-0 ${
                inCart
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-forest-900 text-white hover:bg-forest-800 shadow-xs'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`Add ${product.name} to cart`}
            >
              {inCart ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span className="hidden xxs:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span className="hidden xxs:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
