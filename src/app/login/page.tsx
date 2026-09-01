'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loginAsDemoCustomer } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoCustomer();
    router.push('/account');
  };

  return (
    <div className="min-h-screen py-16 bg-cream-100/60 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-sand-200 p-8 sm:p-10 space-y-6 shadow-card">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center mx-auto shadow-sm">
            <Leaf className="w-6 h-6 text-sage-300" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Welcome Back
          </h1>
          <p className="text-xs text-charcoal-600">
            Sign in to track orders, manage your profile, and save favorites.
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
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
            className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Sign-in */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-sage-400 hover:border-forest-700 bg-sage-50 text-forest-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest-700" />
            <span>Instant Demo Customer Login</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="pt-4 border-t border-sand-200 text-center space-y-2 text-xs text-charcoal-600">
          <p>
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="font-bold text-forest-900 hover:underline">
              Create an account
            </Link>
          </p>
          <p>
            Are you an administrator?{' '}
            <Link href="/admin/login" className="font-semibold text-sage-600 hover:text-forest-900">
              Admin Login Portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
