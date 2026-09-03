'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/db/orders';
import { Order, OrderStatus } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { ShoppingBag, Search, CheckCircle2, AlertCircle } from 'lucide-react';

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const ords = await getOrders();
    setOrders(ords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setStatusMessage(`Order status updated to "${newStatus}".`);
      loadData();
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-admin-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <h1 className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Fulfill orders, track shipping logistics, and update dispatch statuses.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, phone..."
            className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3 py-2 pl-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-zinc-50/70 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
          >
            <option value="">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-400 whitespace-nowrap hidden sm:inline">
            {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-400">Loading order records...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-xs text-zinc-600 font-medium">No orders match your filter</p>
            <p className="text-[11px] text-zinc-400">Try clearing the search or status dropdown</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-50/50">
                  <th className="py-3 px-5 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Customer & Destination</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-admin-body">
                {filteredOrders.map((order) => {
                  const itemsCount = order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
                  const addr = order.shipping_address;

                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-5 align-top">
                        <span className="font-mono font-medium text-zinc-900 block text-xs">
                          {order.order_number}
                        </span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          {formatDate(order.created_at)}
                        </span>
                      </td>

                      {/* Customer & Address Preview */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-medium text-zinc-900 block">
                          {order.customer_name}
                        </span>
                        <span className="text-[11px] text-zinc-500 block">
                          {order.customer_phone}
                        </span>
                        {addr && (
                          <span className="text-[11px] text-zinc-400 block truncate max-w-[200px]">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-medium text-zinc-800 block">
                          {itemsCount} item{itemsCount === 1 ? '' : 's'}
                        </span>
                        <div className="text-[11px] text-zinc-400 max-w-[200px] truncate mt-0.5">
                          {order.items?.map((i) => `${i.product_name} (${i.quantity})`).join(', ')}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-admin-heading font-medium text-zinc-950 block tabular-nums">
                          {formatINR(order.total_amount)}
                        </span>
                        {order.shipping_amount === 0 ? (
                          <span className="text-[10px] text-emerald-700 font-medium">
                            Free Shipping
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400">
                            +₹{order.shipping_amount} shipping
                          </span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="text-[11px] uppercase font-medium text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60 inline-block">
                          {order.payment_method}
                        </span>
                        <span className="text-[10px] text-zinc-400 block mt-1 capitalize">
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4 align-top">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      {/* Status Dropdown Action */}
                      <td className="py-3.5 px-5 text-right align-top">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-zinc-800 font-medium hover:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-forest-800 transition-colors"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
