'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByUserId } from '@/lib/db/orders';
import { Order } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Package, ArrowLeft, ShoppingBag, User } from 'lucide-react';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (user?.id) {
        const userOrders = await getOrdersByUserId(user.id);
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
      setLoading(false);
    }
    loadOrders();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="min-h-screen py-16 bg-cream-100/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-sand-200 p-10 text-center max-w-md w-full space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center">
            <User className="w-8 h-8 text-forest-700" />
          </div>
          <h2 className="font-serif text-xl font-bold text-forest-950">
            Sign In to View Orders
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Please log in with your customer account to view your active dispatches and order history.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block bg-forest-900 text-cream-50 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-forest-800 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-sand-200">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
              Account Overview
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              My Orders
            </h1>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-forest-950"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-sand-200 animate-pulse space-y-4">
                <div className="h-4 bg-sand-200 rounded w-1/4" />
                <div className="h-16 bg-sand-100 rounded" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center">
              <Package className="w-8 h-8 text-forest-700" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest-950">No orders found</h3>
            <p className="text-xs text-charcoal-600">
              You haven&apos;t placed any orders with this account yet. Check out our nature-inspired products to place your first order.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-forest-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm space-y-4 p-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-100 gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                        Order Number
                      </p>
                      <p className="font-mono text-sm font-bold text-forest-950">
                        {order.order_number}
                      </p>
                    </div>

                    <div className="hidden sm:block text-charcoal-300">|</div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                        Date Placed
                      </p>
                      <p className="text-xs text-charcoal-700">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                        Total Amount
                      </p>
                      <p className="text-sm font-bold text-forest-950 font-sans">
                        {formatINR(order.total_amount)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                {/* Products List in this order */}
                <div className="space-y-3 pt-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                        <Image
                          src={
                            item.image_url ||
                            '/images/fallback.svg'
                          }
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-forest-950 truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-charcoal-500">
                          Qty: {item.quantity} • {formatINR(item.product_price)} each
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-forest-900">
                        {formatINR(item.product_price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Footer */}
                <div className="pt-3 border-t border-sand-100 flex flex-col sm:flex-row justify-between text-[11px] text-charcoal-500 gap-2">
                  <span>
                    Payment Mode: <strong className="uppercase">{order.payment_method}</strong> ({order.payment_status})
                  </span>
                  <span>
                    Delivery Address: {order.shipping_address?.street}, {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postalCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
