'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWebsiteContent } from '@/context/ContentContext';
import Image from 'next/image';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  Leaf,
  LogOut,
  Package,
  Sparkles,
  ChevronRight,
  Droplets,
  HeartHandshake,
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';

export const Header: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { content } = useWebsiteContent();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setAccountDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { label: 'Herbal Skincare', href: '/category/herbal-skincare', icon: '✨' },
    { label: 'Hair Care', href: '/category/hair-care', icon: '🌱' },
    { label: 'Natural Bath & Body', href: '/category/bath-and-body', icon: '🧼' },
    { label: 'Organic Essentials', href: '/category/organic-essentials', icon: '🌿' },
    { label: 'Natural Wellness', href: '/category/natural-wellness', icon: '🍃' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Rotating Promo Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <div
        className={`w-full bg-cream-50/95 backdrop-blur-md border-b border-sand-200 transition-all duration-300 ${
          isScrolled ? 'shadow-soft py-0' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Left: Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-1 text-forest-900 hover:text-forest-700 hover:bg-sand-100 rounded-xl transition-colors shrink-0"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                {content.settings.logo_url ? (
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border border-sand-300">
                    <Image
                      src={content.settings.logo_url}
                      alt={content.settings.site_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-forest-900 flex items-center justify-center text-cream-100 shadow-sm group-hover:bg-forest-800 transition-colors shrink-0">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-sage-300" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-serif text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-forest-950 leading-tight truncate">
                    {content.settings.site_name || 'NUTRI LIFE'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-sage-600 hidden xs:block truncate">
                    {content.settings.site_tagline || 'Naturally Better. Everyday.'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              <Link
                href="/"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors pb-1 border-b-2 ${
                  pathname === '/'
                    ? 'text-forest-900 border-forest-900'
                    : 'text-charcoal-700 hover:text-forest-900 border-transparent'
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors pb-1 border-b-2 ${
                  pathname === '/shop'
                    ? 'text-forest-900 border-forest-900'
                    : 'text-charcoal-700 hover:text-forest-900 border-transparent'
                }`}
              >
                Shop All
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-charcoal-700 hover:text-forest-900 transition-colors py-2">
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-elevated border border-sand-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                  {navCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900 rounded-xl transition-colors"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/shop?sort=bestsellers"
                className="text-xs uppercase tracking-wider font-semibold text-charcoal-700 hover:text-forest-900 transition-colors"
              >
                Best Sellers
              </Link>
            </nav>

            {/* Right Actions (Search, Account, Cart, Admin) */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 rounded-full transition-colors"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="flex items-center gap-1.5 p-2 text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 rounded-full transition-colors"
                      aria-label="Account menu"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-elevated border border-sand-200 p-2 z-50 animate-fade-in">
                        <div className="px-3 py-2 border-b border-sand-100 mb-1">
                          <p className="text-xs font-bold text-forest-900 truncate">
                            {profile?.full_name || 'My Account'}
                          </p>
                          <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 rounded-xl"
                        >
                          <User className="w-4 h-4 text-forest-700" /> Account Dashboard
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 rounded-xl"
                        >
                          <Package className="w-4 h-4 text-forest-700" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl mt-1"
                          >
                            <ShieldAlert className="w-4 h-4 text-emerald-700" /> Admin Portal
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl mt-1"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 rounded-full transition-colors inline-block"
                    aria-label="Customer Login"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-forest-900 hover:text-forest-700 hover:bg-sand-100 rounded-full transition-colors"
                aria-label={`View Cart with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-forest-900 text-cream-50 text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Shortcut on Desktop & Tablet */}
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sand-200/80 hover:bg-sand-300 text-forest-900 border border-sand-300 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-forest-700" />
                <span>Admin</span>
              </Link>
            </div>
          </div>

          {/* Search Dropdown / Bar */}
          {searchOpen && (
            <div className="py-3 border-t border-sand-200 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search neem soaps, hair oils, aloe vera, turmeric..."
                  autoFocus
                  className="w-full bg-white border border-sand-300 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-800 shadow-inner"
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 text-charcoal-500 hover:text-charcoal-900 text-xs font-medium px-2 py-1 bg-sand-100 rounded-lg"
                >
                  ESC
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Full Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[calc(40px+4rem)] sm:top-[calc(40px+5rem)] z-50 bg-black/40 backdrop-blur-xs flex">
            <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in border-r border-sand-200 p-5 space-y-6">
              {/* Mobile Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure botanical remedies..."
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </form>

              {/* Main Nav Links */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                  Main Navigation
                </p>
                <Link
                  href="/"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-sage-50 hover:text-forest-900"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-charcoal-400" />
                </Link>
                <Link
                  href="/shop"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-sage-50 hover:text-forest-900"
                >
                  <span>Shop All Products</span>
                  <ChevronRight className="w-4 h-4 text-charcoal-400" />
                </Link>
                <Link
                  href="/shop?sort=bestsellers"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-sage-50 hover:text-forest-900"
                >
                  <span>Best Sellers</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </Link>
              </div>

              {/* Categories */}
              <div className="space-y-1 pt-2 border-t border-sand-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                  Shop by Herbal Category
                </p>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-charcoal-700 hover:bg-sage-50 hover:text-forest-900"
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
                  </Link>
                ))}
              </div>

              {/* Account & Admin Quick Section */}
              <div className="pt-4 border-t border-sand-200 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                  User Account & Tools
                </p>
                {user ? (
                  <div className="space-y-1.5">
                    <Link
                      href="/account"
                      className="block px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-charcoal-800 hover:bg-sage-50"
                    >
                      My Profile ({profile?.full_name || user.email})
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-charcoal-800 hover:bg-sage-50"
                    >
                      My Orders & History
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="text-center py-2.5 px-3 border border-forest-900/30 text-forest-900 font-bold rounded-xl text-xs hover:bg-forest-50"
                    >
                      Customer Login
                    </Link>
                    <Link
                      href="/signup"
                      className="text-center py-2.5 px-3 bg-forest-900 text-cream-50 font-bold rounded-xl text-xs hover:bg-forest-800"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <Link
                  href="/admin"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-sand-100 hover:bg-sand-200 text-forest-950 font-bold rounded-xl text-xs border border-sand-300 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-forest-800" />
                  <span>Admin Management Panel</span>
                </Link>
              </div>
            </div>
            {/* Backdrop click to close */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};
