'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-cream-50 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-sand-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-900" />
              <h2 className="font-serif text-base sm:text-lg font-bold text-forest-900">Your Basket</h2>
              <span className="text-xs bg-sage-100 text-forest-800 font-semibold px-2 py-0.5 rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-charcoal-700 hover:text-forest-900 p-1.5 rounded-lg hover:bg-sand-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-sage-50/80 border-b border-sage-100 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-forest-800 font-medium flex items-center gap-1.5">
                <span className="text-sm">🎉</span> You have unlocked <strong>FREE Shipping!</strong>
              </p>
            ) : (
              <p className="text-charcoal-800">
                Add <strong>{formatINR(freeShippingThreshold - subtotal)}</strong> more to get{' '}
                <strong className="text-forest-900">FREE Shipping</strong>
              </p>
            )}
            <div className="w-full bg-sage-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-forest-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-sand-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">Your basket is empty</h3>
                  <p className="text-xs text-charcoal-700 mt-1 max-w-xs">
                    Explore our botanical remedies, superfoods, and natural skincare to begin.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-forest-900 text-cream-50 px-5 py-2 rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors"
                >
                  <Link href="/shop">Start Shopping</Link>
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isMaxStock = item.quantity >= (item.product.stock ?? 99);
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-sand-200 shadow-sm"
                  >
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-sand-100 shrink-0">
                      <Image
                        src={item.product.images?.[0] || '/images/fallback.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-semibold text-charcoal-900 hover:text-forest-800 line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-charcoal-400 hover:text-rose-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-sand-100">
                        <div className="flex items-center border border-sand-300 rounded-md bg-sand-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-0.5 text-charcoal-700 hover:text-forest-900 disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 text-charcoal-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={isMaxStock}
                            className="px-2 py-0.5 text-charcoal-700 hover:text-forest-900 disabled:opacity-30 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-forest-900">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-sand-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-charcoal-700">Subtotal</span>
                <span className="font-bold text-base text-forest-900">{formatINR(subtotal)}</span>
              </div>
              <p className="text-[11px] text-charcoal-500">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-sand-100 hover:bg-sand-200 text-forest-950 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition-colors text-xs"
                >
                  View Full Basket
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout & Cash on Delivery Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
