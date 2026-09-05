'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const imageUrl =
    item.product.images?.[0] ||
    '/images/fallback.svg';

  const isMaxStock = item.quantity >= (item.product.stock ?? 99);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-sand-200 gap-4 shadow-sm">
      {/* Product Info & Thumbnail */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div className="space-y-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">
            {item.product.category?.name || 'Wellness'}
          </span>
          <Link
            href={`/product/${item.product.slug}`}
            className="font-serif text-sm sm:text-base font-bold text-forest-950 hover:text-forest-700 block truncate"
          >
            {item.product.name}
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-forest-900 font-sans">
              {formatINR(item.product.price)}
            </span>
            {item.product.original_price && item.product.original_price > item.product.price && (
              <span className="text-xs text-charcoal-400 line-through">
                {formatINR(item.product.original_price)}
              </span>
            )}
          </div>
          {item.product.stock < 10 && (
            <span className="text-[10px] text-amber-700 font-medium block">
              Only {item.product.stock} available in stock
            </span>
          )}
        </div>
      </div>

      {/* Quantity and Actions */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-sand-100">
        {/* Quantity Controls */}
        <div className="flex items-center border border-sand-300 rounded-xl bg-sand-50/70 p-1">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs sm:text-sm font-bold text-forest-950 font-sans">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={isMaxStock}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[80px]">
          <span className="text-sm sm:text-base font-bold text-forest-950 font-sans">
            {formatINR(item.product.price * item.quantity)}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={onRemove}
          className="text-charcoal-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
