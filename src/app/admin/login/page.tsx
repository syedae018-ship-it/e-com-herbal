'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  ShieldCheck,
  Mail,
  Lock,
  Leaf,
  AlertCircle,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, loginAsDemoAdmin, user, profile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCredentialForm, setShowCredentialForm] = useState(isSupabaseConfigured());

  // If already an authenticated admin, redirect straight to dashboard
  if (user && profile?.role === 'admin') {
    router.replace('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    // Live Supabase Authentication
    if (isSupabaseConfigured()) {
      const res = await signIn(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid administrator credentials.');
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push('/admin');
      return;
    }

    // Local simulated auth check for preview mode
    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        setError('You do not have administrator access permissions.');
      }
    } else {
      setError(res.error || 'Invalid administrator credentials.');
    }
  };

  const handleDemoAdminLogin = () => {
    loginAsDemoAdmin();
    router.push('/admin');
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf9] flex items-center justify-center font-admin-body text-zinc-900 antialiased">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {/* Brand & Portal Header */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="inline-block text-[10px] uppercase font-semibold tracking-wider text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-100">
              Admin Portal
            </span>
            <h1 className="font-admin-heading text-xl font-semibold tracking-tight text-zinc-950 mt-1.5">
              HERBAL E COM LIFE
            </h1>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Manage your products, catalog, and store orders.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Primary Demo Admin Action */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleDemoAdminLogin}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-medium px-4 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99] group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Continue as Demo Admin</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-300 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Optional Credential Form Toggle */}
        <div className="pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setShowCredentialForm(!showCredentialForm)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 py-1 transition-colors"
          >
            <span>{showCredentialForm ? 'Hide credential login' : 'Sign in with credentials'}</span>
            {showCredentialForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCredentialForm && (
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3 py-2 pl-8 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                  />
                  <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3 py-2 pl-8 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-4 py-2 rounded-lg text-xs transition-colors disabled:opacity-50 mt-1 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>{loading ? 'Authenticating...' : 'Sign In Normally'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Back to Live Store */}
        <div className="text-center pt-2 border-t border-zinc-100">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors"
          >
            ← Return to Live Store
          </Link>
        </div>
      </div>
    </div>
  );
}
