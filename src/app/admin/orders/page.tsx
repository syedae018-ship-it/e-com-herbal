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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Fulfillment & Dispatch
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Order Management ({orders.length})
          </h1>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, email, phone..."
            className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-3 py-2 pl-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
          />
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-sand-50/70 border border-sand-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-charcoal-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-charcoal-400 mx-auto" />
            <p className="text-xs text-charcoal-600">No orders found matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-sand-50/70 border-b border-sand-200 text-charcoal-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Order Details</th>
                  <th className="py-3.5 px-4 font-bold">Customer & Shipping</th>
                  <th className="py-3.5 px-4 font-bold">Items</th>
                  <th className="py-3.5 px-4 font-bold">Total</th>
                  <th className="py-3.5 px-4 font-bold">Payment</th>
                  <th className="py-3.5 px-4 font-bold">Current Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-sand-50/50 transition-colors">
                    {/* Order Details */}
                    <td className="py-4 px-4 align-top">
                      <p className="font-mono font-bold text-forest-950 text-sm">
                        {order.order_number}
                      </p>
                      <p className="text-[11px] text-charcoal-400 mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 align-top space-y-0.5 max-w-[200px]">
                      <p className="font-bold text-charcoal-900">{order.customer_name}</p>
                      <p className="text-[11px] text-charcoal-500 truncate">{order.customer_email}</p>
                      <p className="text-[11px] text-charcoal-500 font-medium">{order.customer_phone}</p>
                      {order.shipping_address?.street && (
                        <p className="text-[10px] text-charcoal-400 line-clamp-2 pt-1 border-t border-sand-100">
                          {order.shipping_address.street}, {order.shipping_address.city},{' '}
                          {order.shipping_address.state} - {order.shipping_address.postalCode}
                        </p>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-charcoal-700">
                              <span className="font-semibold">{it.quantity}x</span> {it.product_name}
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] text-charcoal-400">Products in parcel</span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-bold text-forest-900 font-sans text-sm">
                        {formatINR(order.total_amount)}
                      </span>
                      {order.shipping_amount > 0 && (
                        <span className="block text-[10px] text-charcoal-400">
                          (+{formatINR(order.shipping_amount)} ship)
                        </span>
                      )}
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-bold uppercase text-[11px] text-forest-900 bg-sage-50 px-2 py-0.5 rounded border border-sage-200">
                        {order.payment_method}
                      </span>
                      <span className="block text-[10px] text-charcoal-400 capitalize mt-1">
                        {order.payment_status}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 align-top">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Status Changer */}
                    <td className="py-4 px-4 align-top text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-sand-50 border border-sand-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </option>
                        ))}
                      </select>
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
