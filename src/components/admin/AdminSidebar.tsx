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
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CATALOG',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
      ],
    },
    {
      group: 'FULFILLMENT',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white text-zinc-800 border-r border-zinc-200/80 font-admin-body select-none">
      <div className="space-y-6">
        {/* Brand & Store Identity */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Leaf className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="font-admin-heading text-sm font-semibold tracking-tight text-zinc-950 flex items-center gap-1.5">
                <span>HERBAL E COM LIFE</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                <ShieldCheck className="w-3 h-3 text-forest-700" />
                <span>Store Ops</span>
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Admin Profile Card */}
        <div className="bg-zinc-50 border border-zinc-200/70 p-2.5 rounded-lg flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-forest-900/10 text-forest-900 font-semibold text-xs flex items-center justify-center shrink-0">
            {(profile?.full_name || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-900 truncate">
              {profile?.full_name || 'Store Admin'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {profile?.email || 'admin@herbalecomlife.com'}
            </p>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="space-y-4">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-2.5 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">
                {grp.group}
              </div>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-forest-900/8 text-forest-950 font-semibold border-l-2 border-forest-900 rounded-l-none pl-2.5'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-forest-900' : 'text-zinc-400 group-hover:text-zinc-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-1 pt-4 border-t border-zinc-100">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            <span>View Live Store</span>
          </span>
          <span className="text-[10px] text-zinc-400 uppercase">Public</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed w-60) */}
      <aside className="hidden md:flex w-60 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
