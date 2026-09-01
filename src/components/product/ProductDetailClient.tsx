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
  AlertCircle,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const router = useRouter();
  const { addItem, items, setIsCartOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const existingCartItem = items.find((i) => i.product.id === product.id);
  const currentInCart = existingCartItem?.quantity || 0;
  const maxCanAdd = Math.max(0, (product.stock ?? 0) - currentInCart);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addItem(product, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
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
            Inclusive of all taxes. Free shipping on orders over ₹499.
          </p>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          {product.short_description}
        </p>

        {/* Stock Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              Currently Out of Stock
            </span>
          ) : product.stock < 10 ? (
            <span className="inline-flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ⚡ Only {product.stock} units left in stock — order soon
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              In Stock & Ready to Dispatch
            </span>
          )}
        </div>

        {/* Purchase Actions */}
        {!isOutOfStock ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Quantity:
              </span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock || 99))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                max={product.stock || 99}
              />
              {currentInCart > 0 && (
                <span className="text-[11px] text-sage-700 font-medium">
                  ({currentInCart} already in basket)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ADDED TO BASKET!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-sand-100 rounded-2xl text-center space-y-2">
            <p className="text-xs font-bold text-charcoal-700">This item is currently sold out</p>
            <p className="text-[11px] text-charcoal-500">
              Our botanical batches are freshly prepared in small quantities. Please check back soon!
            </p>
          </div>
        )}

        {/* Trust Badges Minimal */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-sand-200 text-center">
          <div className="p-2.5 rounded-xl bg-sand-50/80 border border-sand-200/60">
            <Leaf className="w-4 h-4 text-forest-700 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-forest-950 block">100% Pure Herbs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sand-50/80 border border-sand-200/60">
            <Truck className="w-4 h-4 text-forest-700 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-forest-950 block">Fast Dispatch</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sand-50/80 border border-sand-200/60">
            <ShieldCheck className="w-4 h-4 text-forest-700 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-forest-950 block">COD Available</span>
          </div>
        </div>

        {/* Accordions */}
        <div className="pt-2">
          <ProductAccordions product={product} />
        </div>
      </div>
    </div>
  );
};
