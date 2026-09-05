'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Leaf,
  ShieldCheck,
  Heart,
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { content } = useWebsiteContent();
  const footer = content.footer;
  const settings = content.settings;

  if (pathname?.startsWith('/admin') || footer.is_enabled === false) {
    return null;
  }

  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 mt-12 sm:mt-20">
      {/* Brand Trust Strip */}
      {footer.trust_badges && footer.trust_badges.length > 0 && (
        <div className="border-b border-forest-900/60 bg-forest-900/40 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {footer.trust_badges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  {idx === 0 && <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-sage-400" />}
                  {idx === 1 && <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sage-400" />}
                  {idx === 2 && <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-sage-400" />}
                  {idx === 3 && <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-sage-400" />}
                  <span className="font-semibold text-[11px] sm:text-xs tracking-wide text-white uppercase mt-0.5 sm:mt-1">
                    {badge.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-sage-300">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              {settings.logo_url ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-sage-400">
                  <Image src={settings.logo_url} alt={settings.site_name || 'NUTRI LIFE'} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-sage-400 flex items-center justify-center text-forest-950 font-bold">
                  <Leaf className="w-4 h-4" />
                </div>
              )}
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                {settings.site_name || 'NUTRI LIFE'}
              </span>
            </Link>
            <p className="text-xs text-sage-200/80 leading-relaxed max-w-sm">
              {footer.about_text ||
                'Naturally Better. Everyday. We formulate clean, honest, and high-potency herbal remedies and nutrition.'}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {footer.instagram_url && (
                <a
                  href={footer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {footer.facebook_url && (
                <a
                  href={footer.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {footer.twitter_url && (
                <a
                  href={footer.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {footer.youtube_url && (
                <a
                  href={footer.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
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
                <Link href="/category/herbal-skincare" className="hover:text-white transition-colors">
                  Herbal Skincare
                </Link>
              </li>
              <li>
                <Link href="/category/hair-care" className="hover:text-white transition-colors">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link href="/category/bath-and-body" className="hover:text-white transition-colors">
                  Bath & Body
                </Link>
              </li>
              <li>
                <Link href="/category/organic-essentials" className="hover:text-white transition-colors">
                  Organic Essentials
                </Link>
              </li>
              <li>
                <Link href="/category/natural-wellness" className="hover:text-white transition-colors">
                  Natural Wellness
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
                <span className="text-[11px] text-sage-400 font-mono">
                  {footer.care_email || settings.contact_email || 'care@herbalecomlife.com'}
                </span>
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
          <p>
            © {new Date().getFullYear()}{' '}
            {footer.copyright_text || 'NUTRI LIFE India. All rights reserved. Naturally Better. Everyday.'}
          </p>
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

