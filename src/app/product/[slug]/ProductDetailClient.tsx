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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-6 sticky top-28">
        <ImageGallery images={product.images || []} productName={product.name} />
      </div>

      {/* Right Column: Product Info & Purchasing */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2">
          {/* Category Pill */}
          <span className="inline-block text-xs uppercase font-bold tracking-widest text-sage-600 bg-sage-50 px-3 py-1 rounded-full border border-sage-200">
            {product.category?.name || 'Organic Wellness'}
          </span>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950 leading-tight">
            {product.name}
          </h1>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-3 pt-1 text-xs">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="font-bold ml-1.5 text-charcoal-900 text-sm">
                {product.rating || 4.9}
              </span>
            </div>
            <span className="text-charcoal-400">•</span>
            <span className="text-charcoal-600 font-medium">
              {product.review_count || 128} verified customer reviews
            </span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-forest-950 font-sans">
              {formatINR(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-base text-charcoal-400 line-through">
                {formatINR(product.original_price)}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-charcoal-500">
            Inclusive of all taxes. Free shipping on orders above ₹499.
          </p>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans">
          {product.short_description}
        </p>

        {/* Quantity and Actions */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
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
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
                ⚡ Only {product.stock} units remaining
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-forest-900 text-cream-50 hover:bg-forest-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added to Basket
                </>
              ) : isOutOfStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> ADD TO CART
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-sand-200 hover:bg-sand-300 text-forest-950 border border-sand-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 text-forest-700" />
              <span>BUY NOW (COD Available)</span>
            </button>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-sand-200 text-center">
          <div className="p-3 bg-white rounded-xl border border-sand-200 space-y-1">
            <Leaf className="w-4 h-4 text-forest-700 mx-auto" />
            <p className="text-[11px] font-bold text-forest-950">100% Organic</p>
            <p className="text-[10px] text-charcoal-500">Pure botanicals</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-sand-200 space-y-1">
            <ShieldCheck className="w-4 h-4 text-forest-700 mx-auto" />
            <p className="text-[11px] font-bold text-forest-950">Lab Tested</p>
            <p className="text-[10px] text-charcoal-500">Zero toxins</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-sand-200 space-y-1">
            <Truck className="w-4 h-4 text-forest-700 mx-auto" />
            <p className="text-[11px] font-bold text-forest-950">Fast Shipping</p>
            <p className="text-[10px] text-charcoal-500">Free above ₹499</p>
          </div>
        </div>

        {/* Detailed Accordions */}
        <ProductAccordions product={product} />
      </div>
    </div>
  );
};
