'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Quote,
  Image as ImageIcon,
  Package,
  Layers,
  ShoppingBag,
  Users,
  MessageSquareQuote,
  Settings,
  PanelBottom,
  Palette,
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

  const navSections = [
    {
      group: 'CMS & Customization',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Themes & Appearance', href: '/admin/themes', icon: Palette },
        { label: 'Homepage Content', href: '/admin/homepage', icon: Home },
        { label: 'Taglines & Text', href: '/admin/taglines', icon: Quote },
        { label: 'Image Management', href: '/admin/images', icon: ImageIcon },
        { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
        { label: 'Website Settings', href: '/admin/settings', icon: Settings },
        { label: 'Footer Settings', href: '/admin/footer', icon: PanelBottom },
      ],
    },
    {
      group: 'Store Management',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Customers', href: '/admin/customers', icon: Users },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-forest-950 text-cream-100 border-r border-forest-900 select-none overflow-y-auto">
      <div className="space-y-5">
        {/* Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-forest-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Leaf className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-white tracking-tight">
                NUTRI LIFE
              </span>
              <div className="flex items-center gap-1 text-[10px] text-sage-300 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Admin Portal</span>
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="md:hidden p-1.5 rounded-lg text-sage-400 hover:text-white hover:bg-forest-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="bg-forest-900/60 p-2.5 rounded-xl border border-forest-800/80">
          <p className="text-xs font-bold text-white truncate">
            {profile?.full_name || 'Store Administrator'}
          </p>
          <p className="text-[10px] text-sage-400 truncate">{profile?.email || 'admin@herbalecomlife.com'}</p>
        </div>

        {/* Nav Sections */}
        <nav className="space-y-4">
          {navSections.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest-400 px-3 py-1">
                {group.group}
              </p>
              {group.items.map((item) => {
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
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
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
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-forest-900 mt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-sage-300 hover:bg-forest-900 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </span>
          <span className="text-[10px] text-sage-400 uppercase">Public</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0">
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

