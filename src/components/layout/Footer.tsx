import React from 'react';
import Link from 'next/link';
import { Leaf, ShieldCheck, Heart, Sparkles, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 mt-20">
      {/* Brand Trust Strip */}
      <div className="border-b border-forest-900/60 bg-forest-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-1">
              <Leaf className="w-6 h-6 text-sage-400" />
              <span className="font-semibold text-xs tracking-wide text-white uppercase mt-1">100% Organic</span>
              <span className="text-[11px] text-sage-300">Pure bioactive botanical extracts</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-sage-400" />
              <span className="font-semibold text-xs tracking-wide text-white uppercase mt-1">Lab Tested</span>
              <span className="text-[11px] text-sage-300">Zero toxins, heavy metals or fillers</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Heart className="w-6 h-6 text-sage-400" />
              <span className="font-semibold text-xs tracking-wide text-white uppercase mt-1">Cruelty-Free</span>
              <span className="text-[11px] text-sage-300">100% Vegan & ethically sourced</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Sparkles className="w-6 h-6 text-sage-400" />
              <span className="font-semibold text-xs tracking-wide text-white uppercase mt-1">Free Shipping</span>
              <span className="text-[11px] text-sage-300">On all prepaid & COD above ₹499</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sage-400 flex items-center justify-center text-forest-950 font-bold">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">HERBAL LIFE</span>
            </Link>
            <p className="text-xs text-sage-200/80 leading-relaxed max-w-sm">
              Naturally Better. Everyday. We formulate clean, honest, and high-potency herbal remedies and nutrition designed to elevate daily health, skin vitality, and hair wellness.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
            <ul className="space-y-2 text-xs text-sage-200/80">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=bestsellers" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/category/herbal-wellness" className="hover:text-white transition-colors">
                  Herbal Wellness
                </Link>
              </li>
              <li>
                <Link href="/category/natural-skincare" className="hover:text-white transition-colors">
                  Natural Skincare
                </Link>
              </li>
              <li>
                <Link href="/category/hair-care" className="hover:text-white transition-colors">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link href="/category/healthy-nutrition" className="hover:text-white transition-colors">
                  Healthy Nutrition
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2 text-xs text-sage-200/80">
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  FAQs & Support
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-sage-400">care@herballife.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">About Us</h4>
            <ul className="space-y-2 text-xs text-sage-200/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Clean Ingredients
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Our Promise
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Ayurvedic Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ACCOUNT & ADMIN */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Account</h4>
            <ul className="space-y-2 text-xs text-sage-200/80">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
              <li className="pt-2 border-t border-forest-900">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-sage-300 hover:text-white font-semibold transition-colors"
                >
                  <span>🔐 Admin Login</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-forest-900/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-400 gap-4">
          <p>© {new Date().getFullYear()} HERBAL LIFE India. All rights reserved. Naturally Better. Everyday.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/shop" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
