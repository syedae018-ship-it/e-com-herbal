'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  LogOut,
  ExternalLink,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 bg-forest-950 text-cream-100 min-h-screen p-5 flex flex-col justify-between border-r border-forest-900 shrink-0">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 pb-5 border-b border-forest-900">
          <div className="w-8 h-8 rounded-full bg-sage-400 flex items-center justify-center text-forest-950 font-bold">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white tracking-tight">
              MUSTAFA LIFE
            </span>
            <div className="flex items-center gap-1 text-[10px] text-sage-300 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Admin Portal</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800/80">
          <p className="text-xs font-bold text-white truncate">
            {profile?.full_name || 'Admin User'}
          </p>
          <p className="text-[11px] text-sage-400 truncate">{profile?.email || 'admin@mustafalife.com'}</p>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-400 text-forest-950 shadow-sm'
                    : 'text-sage-200/80 hover:bg-forest-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 border-t border-forest-900">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-sage-300 hover:bg-forest-900 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5" /> View Live Store
          </span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
