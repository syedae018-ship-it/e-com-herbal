'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Package, ShoppingBag, LogOut, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, profile, signOut, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen py-16 bg-cream-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-sand-200 text-center max-w-md w-full space-y-4 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-forest-950">
            Please Sign In
          </h2>
          <p className="text-xs text-charcoal-600">
            Sign in to your account to view profile information and order history.
          </p>
          <Link
            href="/login"
            className="inline-block bg-forest-900 text-cream-50 px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-forest-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen py-10 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-900 text-xl font-bold font-serif">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
                Customer Account
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                Hello, {profile?.full_name || 'Valued Customer'}
              </h1>
              <p className="text-xs text-charcoal-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 border border-sand-300 text-charcoal-700 hover:text-rose-600 hover:border-rose-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: My Orders */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-900 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-950">My Orders</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Track active dispatches, view invoice summaries, and review past purchases.
              </p>
            </div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-forest-700 pt-3 border-t border-sand-100"
            >
              <span>View Order History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Shop Wellness */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sage-100 text-forest-900 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Discover Products</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Explore newly harvested batches of organic Ayurvedic supplements and skincare.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-forest-700 pt-3 border-t border-sand-100"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Member Benefits */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Account Status</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Role: <strong className="uppercase">{profile?.role || 'Customer'}</strong> • Free shipping unlocked on all qualifying orders over ₹499.
              </p>
            </div>
            <div className="pt-3 border-t border-sand-100 text-[11px] text-sage-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Nutri Life Member
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
