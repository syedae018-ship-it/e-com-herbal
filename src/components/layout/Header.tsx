'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
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
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountDropdownOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Herbal Wellness', href: '/category/herbal-wellness' },
    { label: 'Natural Skincare', href: '/category/natural-skincare' },
    { label: 'Hair Care', href: '/category/hair-care' },
    { label: 'Healthy Nutrition', href: '/category/healthy-nutrition' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Rotating Promo Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <div
        className={`w-full bg-cream-50/95 backdrop-blur-md border-b border-sand-200 transition-shadow duration-300 ${
          isScrolled ? 'shadow-soft' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-forest-900 hover:text-forest-700 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-forest-900 flex items-center justify-center text-cream-100 shadow-sm group-hover:bg-forest-800 transition-colors">
                <Leaf className="w-5 h-5 text-sage-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-forest-950 leading-none">
                  MUSTAFA LIFE
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-sage-500 mt-1">
                  Naturally Better. Everyday.
                </span>
              </div>
            </Link>

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
                Shop
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-charcoal-700 hover:text-forest-900 transition-colors py-2">
                  Categories <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-elevated border border-sand-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <Link
                    href="/category/herbal-wellness"
                    className="block px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900 rounded-lg"
                  >
                    🌿 Herbal Wellness
                  </Link>
                  <Link
                    href="/category/natural-skincare"
                    className="block px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900 rounded-lg"
                  >
                    ✨ Natural Skincare
                  </Link>
                  <Link
                    href="/category/hair-care"
                    className="block px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900 rounded-lg"
                  >
                    🌱 Hair Care
                  </Link>
                  <Link
                    href="/category/healthy-nutrition"
                    className="block px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900 rounded-lg"
                  >
                    🍃 Healthy Nutrition
                  </Link>
                  <Link
                    href="/category/daily-essentials"
                    className="block px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900 rounded-lg"
                  >
                    ☀️ Daily Essentials
                  </Link>
                </div>
              </div>

              <Link
                href="/shop?sort=bestsellers"
                className="text-xs uppercase tracking-wider font-semibold text-charcoal-700 hover:text-forest-900 transition-colors"
              >
                Best Sellers
              </Link>
            </nav>

            {/* Right Action Icons & Admin Button */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 rounded-full transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Account Button & Menu */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="flex items-center gap-1.5 p-2 text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 rounded-full transition-colors"
                      aria-label="Account menu"
                    >
                      <User className="w-5 h-5" />
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-elevated border border-sand-200 p-2 z-50 animate-fade-in">
                        <div className="px-3 py-2 border-b border-sand-100 mb-1">
                          <p className="text-xs font-bold text-forest-900 truncate">
                            {profile?.full_name || 'My Account'}
                          </p>
                          <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 rounded-lg"
                        >
                          <User className="w-4 h-4 text-forest-700" /> Account Dashboard
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-800 hover:bg-sage-50 rounded-lg"
                        >
                          <Package className="w-4 h-4 text-forest-700" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg mt-1"
                          >
                            <ShieldAlert className="w-4 h-4 text-emerald-700" /> Admin Portal
                          </Link>
                        )}
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg mt-1"
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
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-forest-900 hover:text-forest-700 hover:bg-sand-100 rounded-full transition-colors"
                aria-label={`View Cart with ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-forest-900 text-cream-50 text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Login Button - Prompt Requirement: "clearly visible Admin Login button" */}
              <Link
                href="/admin/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sand-200/80 hover:bg-sand-300 text-forest-900 border border-sand-300 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-forest-700" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>

          {/* Search Bar Overlay */}
          {searchOpen && (
            <div className="py-3 border-t border-sand-200 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search organic moringa, turmeric, face wash, hair oils..."
                  autoFocus
                  className="w-full bg-white border border-sand-300 rounded-xl px-4 py-2.5 pl-11 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-4" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 text-charcoal-400 hover:text-charcoal-800 text-xs font-medium px-2 py-1 bg-sand-100 rounded-md"
                >
                  ESC
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sand-200 bg-white px-4 py-5 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 pl-9 text-sm"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            </form>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                Explore Products
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-sage-50 hover:text-forest-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-sand-200 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                Account & Admin
              </p>
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-sage-50"
                  >
                    My Account ({profile?.full_name})
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-sage-50"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="text-center py-2 px-3 border border-forest-900/20 text-forest-900 font-semibold rounded-lg text-xs"
                  >
                    Customer Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-center py-2 px-3 bg-forest-900 text-cream-50 font-semibold rounded-lg text-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <Link
                href="/admin/login"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-sand-100 text-forest-950 font-semibold rounded-lg text-xs border border-sand-300 mt-2"
              >
                <ShieldAlert className="w-4 h-4 text-forest-800" />
                Admin Portal Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
