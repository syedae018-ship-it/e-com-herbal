'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/db/orders';
import { formatINR } from '@/lib/utils';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  User,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingAmount, totalAmount, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If user state updates after mounting, populate fields
  React.useEffect(() => {
    if (profile?.full_name && !fullName) {
      setFullName(profile.full_name);
    }
    if ((profile?.email || user?.email) && !email) {
      setEmail(profile?.email || user?.email || '');
    }
  }, [profile, user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorMessage('Your basket is empty. Please add products before checking out.');
      return;
    }

    if (!fullName || !email || !phone || !street || !city || !state || !postalCode) {
      setErrorMessage('Please fill in all required delivery address fields.');
      return;
    }

    if (paymentMethod === 'online') {
      setErrorMessage('Online payment gateway integration will be active in the upcoming release. Please choose Cash on Delivery.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const orderData = {
        user_id: user?.id || null,
        customer_name: fullName.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        status: 'pending' as const,
        payment_method: 'cod' as const,
        payment_status: 'pending' as const,
        subtotal,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        shipping_address: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        },
      };

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.images?.[0] || '',
      }));

      const res = await createOrder(orderData, orderItems);

      if (res.success && res.order) {
        // Clear cart only after confirmed successful creation
        clearCart();
        router.push(`/order-success?orderNumber=${res.order.order_number}`);
      } else {
        setErrorMessage(res.error || 'Failed to place order. Please check item availability and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 bg-cream-100/50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-sand-200 text-center max-w-md w-full space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-forest-800">
            <Truck className="w-8 h-8 text-forest-700" />
          </div>
          <h2 className="font-serif text-xl font-bold text-forest-950">
            Your basket is empty
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Please select your desired herbal remedies and natural wellness items before proceeding to checkout.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-forest-900 text-cream-50 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-forest-800 transition-colors shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If customer is not authenticated, prompt to sign in or create account
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen py-16 bg-cream-100/50 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sand-200 text-center max-w-md w-full space-y-5 shadow-card">
          <div className="w-16 h-16 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center">
            <User className="w-8 h-8 text-forest-700" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              Sign In to Complete Order
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Please sign in or create a customer account to save your delivery addresses and track your herbal wellness dispatches.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login"
              className="w-full inline-block bg-forest-900 text-cream-50 font-bold py-3 px-6 rounded-xl text-xs sm:text-sm hover:bg-forest-800 transition-colors shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full inline-block bg-white text-forest-950 border border-sand-300 font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-sand-50 transition-colors"
            >
              Create New Account
            </Link>
          </div>

          <p className="text-[11px] text-charcoal-500 pt-2 border-t border-sand-100">
            Your {items.length} selected {items.length === 1 ? 'item' : 'items'} will remain saved in your basket.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back */}
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Basket
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-2">
            Secure Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Delivery Details & Payment Mode */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer & Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand-100">
                <div className="w-6 h-6 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-forest-950">
                  Shipping & Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Phone Number (for Courier Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Street Address, Flat / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 42 Lotus Boulevard, 4th Floor"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="560001"
                    className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand-100">
                <div className="w-6 h-6 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-forest-950">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery Option */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-forest-800 bg-sage-50/50'
                      : 'border-sand-200 hover:border-sand-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-forest-900 focus:ring-forest-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-forest-950 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                      Pay securely with cash or UPI upon package arrival at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Online Payment (Coming Soon) */}
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-sand-200 bg-sand-50/50 opacity-70">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    disabled
                    className="mt-1 text-charcoal-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-charcoal-500 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Online Payment (UPI, Cards, NetBanking)
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-600 bg-sand-200 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Direct payment gateway integration will be active in the next release.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Processing Order...' : `PLACE CASH ON DELIVERY ORDER • ${formatINR(totalAmount)}`}</span>
            </button>
          </form>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-forest-950 pb-3 border-b border-sand-100">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Item Mini List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-sand-100">
              {items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        '/images/fallback.svg'
                      }
                      alt={item.product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-forest-950 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-charcoal-500">
                      Qty: {item.quantity} • {formatINR(item.product.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-forest-900">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-sand-200 text-xs sm:text-sm">
              <div className="flex justify-between text-charcoal-700">
                <span>Items Subtotal</span>
                <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-700">
                <span>Shipping & Delivery</span>
                {shippingAmount === 0 ? (
                  <span className="font-bold text-emerald-800 uppercase text-xs">FREE</span>
                ) : (
                  <span className="font-semibold text-charcoal-900">{formatINR(shippingAmount)}</span>
                )}
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-sand-200 text-base sm:text-lg">
                <span className="font-serif font-bold text-forest-950">Total Payable</span>
                <span className="font-bold text-forest-900 font-sans">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-100 space-y-2 text-xs text-forest-950">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Nutri Life Pure Quality Guarantee</span>
              </div>
              <p className="text-[11px] text-charcoal-600 leading-relaxed">
                All botanical batches are 100% natural, tested for purity, and safely packed in eco-friendly packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
