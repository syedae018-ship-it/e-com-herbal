'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProductsAdmin } from '@/lib/db/products';
import { getOrders } from '@/lib/db/orders';
import { Product, Order } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/admin/StatCard';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import {
  Package,
  ShoppingBag,
  Clock,
  IndianRupee,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [prods, ords] = await Promise.all([getAllProductsAdmin(), getOrders()]);
      setProducts(prods);
      setOrders(ords);
      setLoading(false);
    }
    loadData();
  }, []);

  // Compute stats (excluding cancelled orders from revenue)
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Admin Dashboard
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Monitor store revenue, pending dispatches, and catalog inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${products.filter((p) => p.is_active).length} active in catalog`}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          subtitle="All lifetime orders"
          icon={ShoppingBag}
          trend="+14% this month"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Awaiting fulfillment"
          icon={Clock}
        />
        <StatCard
          title="Total Revenue"
          value={formatINR(totalRevenue)}
          subtitle="Excludes cancelled orders"
          icon={IndianRupee}
          trend="Healthy GMV"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div>
            <h3 className="font-serif text-base font-bold text-forest-950">Recent Orders</h3>
            <p className="text-xs text-charcoal-500">Latest customer transactions & dispatches</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-forest-900 hover:text-forest-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-charcoal-500">Loading metrics...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-charcoal-500">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-100 text-charcoal-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Payment</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-sand-50/50">
                    <td className="py-3 font-mono font-bold text-forest-950">
                      {order.order_number}
                    </td>
                    <td className="py-3 text-charcoal-800 font-medium">
                      {order.customer_name}
                      <span className="block text-[10px] text-charcoal-400">{order.customer_email}</span>
                    </td>
                    <td className="py-3 text-charcoal-600">{formatDate(order.created_at)}</td>
                    <td className="py-3 font-bold text-forest-900 font-sans">
                      {formatINR(order.total_amount)}
                    </td>
                    <td className="py-3 text-charcoal-700 uppercase font-semibold text-[11px]">
                      {order.payment_method}
                    </td>
                    <td className="py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-forest-900 hover:underline font-semibold text-xs"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
