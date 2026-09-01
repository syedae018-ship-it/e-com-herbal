'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  onCheckoutClick?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingAmount,
  totalAmount,
  freeShippingThreshold,
  freeShippingProgress,
  onCheckoutClick,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try WELCOME10');
    }
  };

  const discountAmount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, totalAmount - discountAmount);

  return (
    <div className="bg-white rounded-2xl border border-sand-200 p-6 space-y-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-forest-950 pb-3 border-b border-sand-200">
        Order Summary
      </h3>

      {/* Free Shipping Progress */}
      <div className="p-4 bg-sage-50/80 rounded-xl border border-sage-100 space-y-2">
        <div className="flex justify-between text-xs font-medium text-forest-900">
          {subtotal >= freeShippingThreshold ? (
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-forest-700" /> You unlocked FREE Shipping!
            </span>
          ) : (
            <span>
              Add <strong>{formatINR(freeShippingThreshold - subtotal)}</strong> for free shipping
            </span>
          )}
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-forest-700 h-full rounded-full transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Have a coupon?
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="e.g. WELCOME10"
              className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-3 py-2 text-xs font-semibold uppercase text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
            <Tag className="w-3.5 h-3.5 text-charcoal-400 absolute right-3 top-3" />
          </div>
          <button
            type="submit"
            className="bg-forest-900 text-cream-50 hover:bg-forest-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            ✓ Coupon WELCOME10 applied (10% Off)
          </p>
        )}
        {promoError && <p className="text-xs text-rose-600 font-medium">{promoError}</p>}
      </form>

      {/* Cost Breakdown */}
      <div className="space-y-3 pt-3 border-t border-sand-200 text-xs sm:text-sm">
        <div className="flex justify-between text-charcoal-700">
          <span>Bag Subtotal</span>
          <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Special Discount (10%)</span>
            <span>-{formatINR(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-charcoal-700">
          <span>Standard Delivery</span>
          <span>
            {shippingAmount === 0 ? (
              <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
            ) : (
              formatINR(shippingAmount)
            )}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-4 border-t border-sand-200 text-base sm:text-lg font-bold text-forest-950">
          <span>Total Amount</span>
          <span className="font-sans text-forest-900">{formatINR(finalTotal)}</span>
        </div>
        <p className="text-[11px] text-charcoal-500">Includes all applicable GST & herbal cess</p>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <Link
          href="/checkout"
          onClick={onCheckoutClick}
          className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-card"
        >
          <span>PROCEED TO CHECKOUT</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/shop"
          className="w-full text-center block text-xs font-semibold text-forest-800 hover:text-forest-950 py-2 transition-colors"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Trust reassurance */}
      <div className="p-3 bg-cream-50 rounded-xl border border-sand-200/80 flex items-center justify-center gap-2 text-xs text-forest-900 font-medium">
        <ShieldCheck className="w-4 h-4 text-forest-700" />
        <span>100% Guaranteed Purity & Safe Delivery</span>
      </div>
    </div>
  );
};
