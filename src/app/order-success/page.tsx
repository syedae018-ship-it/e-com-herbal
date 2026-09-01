'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderByNumber } from '@/lib/db/orders';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { CheckCircle2, Package, Home, Sparkles, Truck, ShieldAlert, AlertCircle } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (orderNumber) {
        const data = await getOrderByNumber(orderNumber);
        setOrder(data);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen py-16 bg-cream-100/60 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-sand-200 p-12 space-y-6 text-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-sand-200 mx-auto" />
          <div className="h-6 bg-sand-200 rounded w-1/2 mx-auto" />
          <div className="h-32 bg-sand-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!orderNumber || !order) {
    return (
      <div className="min-h-screen py-16 bg-cream-100/60 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-sand-200 p-10 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">
            Order Not Found
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            We couldn&apos;t locate an order with the provided reference number. Please check your account or contact customer support.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/account/orders"
              className="inline-block bg-forest-900 text-cream-50 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-forest-800 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="inline-block bg-sand-100 text-forest-950 font-semibold px-6 py-2.5 rounded-xl text-xs hover:bg-sand-200 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Security Check: If order belongs to a specific registered user, verify authorization
  if (order.user_id && user && order.user_id !== user.id && !isAdmin) {
    return (
      <div className="min-h-screen py-16 bg-cream-100/60 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-sand-200 p-10 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">
            Access Restricted
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            This order receipt is linked to a different customer account. Please log in with the correct account to view details.
          </p>
          <div className="pt-2">
            <Link
              href="/account/orders"
              className="inline-block bg-forest-900 text-cream-50 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-forest-800 transition-colors"
            >
              Go to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-cream-100/60 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-sand-200 p-8 sm:p-12 space-y-8 shadow-card text-center">
        {/* Celebration Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-200 text-emerald-800 mx-auto flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-700" />
        </div>

        {/* Header Message */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-800 bg-sage-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
            We have received your order and are carefully preparing your fresh organic wellness items for dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-cream-50 rounded-2xl border border-sand-200 p-6 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                Order Reference
              </p>
              <p className="font-mono text-sm sm:text-base font-extrabold text-forest-950">
                {order.order_number}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal-600 font-medium">Status:</span>
              <OrderStatusBadge status={order.status || 'pending'} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-charcoal-500 font-semibold">Payment Mode:</p>
              <p className="font-bold text-forest-950 mt-0.5">
                Cash on Delivery (Pay upon arrival)
              </p>
            </div>

            <div>
              <p className="text-charcoal-500 font-semibold">Total Amount Due:</p>
              <p className="font-bold text-forest-950 text-sm mt-0.5">
                {formatINR(order.total_amount)}
              </p>
            </div>

            {order.customer_name && (
              <div className="sm:col-span-2 pt-2 border-t border-sand-200">
                <p className="text-charcoal-500 font-semibold">Delivery Address:</p>
                <p className="text-charcoal-900 font-medium mt-0.5">
                  {order.customer_name} • {order.customer_phone}
                </p>
                <p className="text-charcoal-600">
                  {order.shipping_address?.street}, {order.shipping_address?.city},{' '}
                  {order.shipping_address?.state} - {order.shipping_address?.postalCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/account/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-7 py-3 rounded-xl text-xs sm:text-sm shadow-sm transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>VIEW MY ORDERS</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-forest-950 border border-sand-300 hover:bg-sand-100 font-semibold px-7 py-3 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-forest-800 font-medium">
          <Truck className="w-4 h-4 text-forest-600" />
          <span>Expected Delivery in 2–4 Business Days across India</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 bg-cream-100/60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-forest-800 border-t-transparent" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
