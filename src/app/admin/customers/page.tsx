'use client';

import React, { useState, useEffect } from 'react';
import { getOrders } from '@/lib/db/orders';
import { Order } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import { Users, Mail, ShoppingBag, Search, ExternalLink } from 'lucide-react';

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const ords = await getOrders();
      setOrders(ords);
      setLoading(false);
    }
    loadData();
  }, []);

  // Deduplicate customers by email
  const customersMap = new Map<
    string,
    {
      name: string;
      email: string;
      phone: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: string;
      city: string;
    }
  >();

  orders.forEach((o) => {
    const key = o.customer_email.toLowerCase();
    const existing = customersMap.get(key);
    if (!existing) {
      customersMap.set(key, {
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
        totalOrders: 1,
        totalSpent: o.total_amount,
        lastOrderDate: o.created_at,
        city: o.shipping_address?.city || 'India',
      });
    } else {
      existing.totalOrders += 1;
      existing.totalSpent += o.total_amount;
      if (new Date(o.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.created_at;
      }
    }
  });

  const customersList = Array.from(customersMap.values());
  const filtered = customersList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6 max-w-5xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Customer Directory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Customers & Subscribers
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            View customer order histories, total lifetime value, and contact directories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, email..."
              className="bg-white border border-sand-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700 w-64"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-sage-300" />
          </div>
          <div>
            <span className="text-xs text-charcoal-500 font-medium">Total Customers</span>
            <p className="text-xl font-bold font-serif text-forest-950">{customersList.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sage-100 text-forest-900 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-500 font-medium">Lifetime Orders</span>
            <p className="text-xl font-bold font-serif text-forest-950">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-500 font-medium">Active Leads</span>
            <p className="text-xl font-bold font-serif text-forest-950">{customersList.length + 12}</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-charcoal-500">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal-500">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 text-charcoal-400 uppercase tracking-wider font-bold text-[10px] bg-sand-50/60">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-sand-50/50">
                    <td className="py-3.5 px-4 font-bold text-forest-950">{c.name}</td>
                    <td className="py-3.5 px-4 text-charcoal-600">
                      <p className="font-medium text-charcoal-800">{c.email}</p>
                      <p className="text-[11px] text-charcoal-400">{c.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-600">{c.city}</td>
                    <td className="py-3.5 px-4 font-semibold text-forest-900">{c.totalOrders}</td>
                    <td className="py-3.5 px-4 font-bold text-forest-900">{formatINR(c.totalSpent)}</td>
                    <td className="py-3.5 px-4 text-charcoal-500">{formatDate(c.lastOrderDate)}</td>
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
