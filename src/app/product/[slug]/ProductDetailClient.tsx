'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { formatINR, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { ImageGallery } from '@/components/product/ImageGallery';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { ProductAccordions } from '@/components/product/ProductAccordions';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <ImageGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Right Column: Product Info & Purchasing */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            {/* Category Pill */}
            <span className="inline-block text-[10px] sm:text-xs uppercase font-bold tracking-widest text-sage-600 bg-sage-50 px-2.5 sm:px-3 py-1 rounded-full border border-sage-200">
              {product.category?.name || 'Organic Wellness'}
            </span>

            {/* Title */}
            <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-forest-950 leading-tight">
              {product.name}
            </h1>

            {/* Star Rating & Review Count */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-bold ml-1.5 text-charcoal-900 text-xs sm:text-sm">
                  {product.rating || 4.9}
                </span>
              </div>
              <span className="text-charcoal-400 hidden sm:inline">•</span>
              <span className="text-charcoal-600 font-medium text-[11px] sm:text-xs">
                {product.review_count || 128} verified reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3.5 sm:p-5 bg-white rounded-2xl border border-sand-200 shadow-sm space-y-1.5 sm:space-y-2">
            <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-extrabold text-forest-950 font-sans">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm sm:text-base text-charcoal-400 line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-charcoal-500">
              Inclusive of all taxes. Free shipping on orders above ₹499 across India.
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans">
            {product.short_description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Quantity:
              </span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                max={product.stock}
              />
              {product.stock > 0 && product.stock <= 10 && (
                <span className="text-[11px] sm:text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                  ⚡ Only {product.stock} left
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-forest-900 text-cream-50 hover:bg-forest-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'Added to Cart!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-sand-200 text-forest-950 hover:bg-sand-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-forest-800" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-3 sm:pt-4 border-t border-sand-200 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 sm:p-3 rounded-xl bg-cream-50 border border-sand-200/60 space-y-0.5 sm:space-y-1">
              <Leaf className="w-4 h-4 text-forest-700 mx-auto" />
              <p className="text-[9px] sm:text-[10px] font-bold text-forest-950">100% Organic</p>
              <p className="text-[8px] sm:text-[9px] text-charcoal-500 hidden xs:block">Pure extracts</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-cream-50 border border-sand-200/60 space-y-0.5 sm:space-y-1">
              <Truck className="w-4 h-4 text-forest-700 mx-auto" />
              <p className="text-[9px] sm:text-[10px] font-bold text-forest-950">Fast Shipping</p>
              <p className="text-[8px] sm:text-[9px] text-charcoal-500 hidden xs:block">Dispatched in 24h</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-cream-50 border border-sand-200/60 space-y-0.5 sm:space-y-1">
              <ShieldCheck className="w-4 h-4 text-forest-700 mx-auto" />
              <p className="text-[9px] sm:text-[10px] font-bold text-forest-950">Ayurvedic</p>
              <p className="text-[8px] sm:text-[9px] text-charcoal-500 hidden xs:block">Lab certified</p>
            </div>
          </div>

          {/* Detailed Accordions */}
          <div className="pt-2 sm:pt-4">
            <ProductAccordions product={product} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile Screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-sand-200 p-3 shadow-elevated flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-forest-950 truncate">{product.name}</p>
          <p className="text-xs font-extrabold text-forest-900">{formatINR(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm ${
            added ? 'bg-emerald-700 text-white' : 'bg-forest-900 text-cream-50'
          } disabled:opacity-50`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{added ? 'Added!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </>
  );
};
