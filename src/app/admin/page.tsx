'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
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

  // Compute metrics (excluding cancelled orders from revenue)
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Stock health analytics
  const outOfStockProducts = activeProducts.filter((p) => (p.stock ?? 0) <= 0);
  const lowStockProducts = activeProducts.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 15);
  const healthyStockProducts = activeProducts.filter((p) => (p.stock ?? 0) > 15);
  const attentionProducts = [...outOfStockProducts, ...lowStockProducts];

  return (
    <div className="space-y-6 font-admin-body">
      {/* 4. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <h1 className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Overview of your store performance and operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-forest-900 text-white hover:bg-forest-800 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 5. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={loading ? '...' : totalProducts}
          subtitle={`${activeProducts.length} active in catalog`}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={loading ? '...' : totalOrders}
          subtitle="All lifetime orders"
          icon={ShoppingBag}
        />
        <StatCard
          title="Pending Dispatches"
          value={loading ? '...' : pendingOrders}
          subtitle="Awaiting fulfillment"
          icon={Clock}
          badge={
            pendingOrders > 0
              ? { text: `${pendingOrders} action required`, variant: 'warning' }
              : { text: 'All processed', variant: 'success' }
          }
        />
        <StatCard
          title="Total Revenue"
          value={loading ? '...' : formatINR(totalRevenue)}
          subtitle="Excludes cancelled orders"
          icon={IndianRupee}
        />
      </div>

      {/* 6. Operational Stock Health Section */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-admin-heading text-base font-semibold text-zinc-950">
                Inventory & Stock Health
              </h2>
              {attentionProducts.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>{attentionProducts.length} item{attentionProducts.length > 1 ? 's' : ''} require attention</span>
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live inventory tracking across active catalog items
            </p>
          </div>

          {/* Restrained semantic indicators */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Healthy ({healthyStockProducts.length})</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Low stock ({lowStockProducts.length})</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Out of stock ({outOfStockProducts.length})</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-zinc-400">Evaluating inventory levels...</div>
        ) : attentionProducts.length === 0 ? (
          <div className="py-5 px-4 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All active products are currently well-stocked with 15+ units available.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attentionProducts.slice(0, 6).map((product) => {
              const isOut = (product.stock ?? 0) <= 0;
              return (
                <div
                  key={product.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                    isOut
                      ? 'bg-rose-50/40 border-rose-200/80'
                      : 'bg-amber-50/40 border-amber-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-md bg-white border border-zinc-200 overflow-hidden relative shrink-0">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-[10px]">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOut ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                        />
                        <span
                          className={`text-[11px] font-medium ${
                            isOut ? 'text-rose-700' : 'text-amber-800'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : `${product.stock} units left`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/products/${product.id}`}
                    className="shrink-0 text-[11px] font-medium text-forest-900 hover:text-forest-700 px-2 py-1 rounded bg-white border border-zinc-200 hover:border-zinc-300 transition-colors"
                  >
                    Update
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Recent Transactions / Orders */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-zinc-100">
          <div>
            <h2 className="font-admin-heading text-base font-semibold text-zinc-950">
              Recent Transactions
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Latest customer orders across all channels
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-forest-900 hover:text-forest-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-400">Loading order records...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">No customer orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-50/50">
                  <th className="py-3 px-5 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-admin-body">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-zinc-900 font-medium">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-900">
                      <div className="font-medium text-zinc-900">{order.customer_name}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3.5 px-4 font-admin-heading font-medium text-zinc-950 tabular-nums">
                      {formatINR(order.total_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] uppercase font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-forest-900 hover:text-forest-700 font-medium text-xs hover:underline"
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
