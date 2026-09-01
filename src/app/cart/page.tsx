'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingAmount,
    totalAmount,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  return (
    <div className="min-h-screen py-10 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
              Shopping Cart
            </span>
            <h1 className="font-serif text-3xl font-bold text-forest-950">
              Your Wellness Basket
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold self-start sm:self-auto"
            >
              Clear Basket
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-forest-700" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                Your basket is empty
              </h2>
              <p className="text-xs text-charcoal-600 max-w-sm mx-auto leading-relaxed">
                You haven&apos;t added any herbal wellness items yet. Explore our farm-fresh remedies and organic skincare to get started.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 font-bold px-7 py-3 rounded-xl hover:bg-forest-800 transition-colors text-xs sm:text-sm shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          /* Main Cart Content: Left Items List + Right Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={(q) => updateQuantity(item.product.id, q)}
                  onRemove={() => removeItem(item.product.id)}
                />
              ))}

              <div className="pt-4 flex justify-between items-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-28">
              <CartSummary
                subtotal={subtotal}
                shippingAmount={shippingAmount}
                totalAmount={totalAmount}
                freeShippingThreshold={freeShippingThreshold}
                freeShippingProgress={freeShippingProgress}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
