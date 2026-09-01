'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, loginAsDemoAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your administrator email.');
      return;
    }

    setLoading(true);
    setError('');

    if (isSupabaseConfigured() && supabase) {
      if (!password) {
        setError('Password is required.');
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !authData.user) {
        setLoading(false);
        setError(authError?.message || 'Invalid administrator credentials.');
        return;
      }

      // Check role in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData || profileData.role !== 'admin') {
        // Sign out unauthorized user
        await supabase.auth.signOut();
        setLoading(false);
        setError('You do not have administrator access.');
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
        setError('You do not have administrator access.');
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
    <div className="min-h-screen py-16 bg-forest-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-forest-900 p-8 sm:p-10 space-y-6 shadow-2xl">
        {/* Admin Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-forest-900 text-cream-50 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-sage-300" />
          </div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Secure Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Admin Authentication
          </h1>
          <p className="text-xs text-charcoal-600">
            Sign in with an authorized administrator account to manage products, catalog, and customer orders.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@herballife.com"
                className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md disabled:opacity-50"
          >
            <span>{loading ? 'Verifying Permissions...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Admin Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoAdminLogin}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50 text-emerald-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>One-Click Demo Admin Login</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-sand-200 text-center space-y-2 text-xs text-charcoal-500">
          <p>
            Looking for regular customer login?{' '}
            <Link href="/login" className="font-bold text-forest-900 hover:underline">
              Customer Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
