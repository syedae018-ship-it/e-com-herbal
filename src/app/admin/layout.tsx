'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();

  // If on admin login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-forest-800 border-t-transparent" />
      </div>
    );
  }

  // Access control
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-sand-200 text-center max-w-md w-full space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-forest-950">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            You must be signed in with an administrator role to access this portal.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-block bg-forest-900 text-cream-50 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-forest-800 transition-colors shadow-sm"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-sand-50/60">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}
