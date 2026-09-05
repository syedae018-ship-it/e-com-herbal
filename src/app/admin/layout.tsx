'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { ShieldAlert, Menu, Leaf } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on admin login page, render children directly without admin shell
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#f8faf9] font-admin-body text-zinc-900 antialiased selection:bg-forest-900/10 selection:text-forest-950">
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] font-admin-body flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-forest-800 border-t-transparent animate-spin" />
        <span className="text-xs font-medium text-zinc-500 tracking-wide">
          Verifying administrator credentials...
        </span>
      </div>
    );
  }

  // Access control fallback
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8faf9] font-admin-body flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-zinc-200/90 text-center max-w-sm w-full space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="space-y-1">
            <h2 className="font-admin-heading text-lg font-semibold tracking-tight text-zinc-900">
              Admin Access Required
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed font-admin-body">
              You must be signed in with an administrator role to access this portal.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center w-full bg-forest-900 text-white font-medium px-4 py-2 rounded-lg text-xs hover:bg-forest-800 transition-colors shadow-sm"
            >
              Sign In to Admin Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8faf9] font-admin-body text-zinc-900 antialiased selection:bg-forest-900/10 selection:text-forest-950">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200/80 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-900 text-white flex items-center justify-center font-bold">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <span className="font-admin-heading text-sm font-semibold tracking-tight text-zinc-900">
            NUTRI LIFE
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium">Ops</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
