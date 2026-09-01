import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-cream-100 via-cream-50 to-sand-50 py-16 lg:py-24 overflow-hidden border-b border-sand-200">
      {/* Decorative botanical background blurbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sage-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-sand-200/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100 border border-sage-200/60 text-forest-900 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-forest-700" />
              <span>Pure Wellness, Powered by Nature</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
              Wellness, the <br className="hidden sm:inline" />
              <span className="text-forest-700 italic font-normal">Natural Way.</span>
            </h1>

            <p className="text-sm sm:text-base text-charcoal-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Discover thoughtfully crafted organic and herbal products made for healthier everyday living. Clean botanical ingredients, ancient Ayurvedic wisdom, and zero harsh chemicals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-900 text-cream-50 font-semibold px-8 py-3.5 rounded-xl shadow-card hover:bg-forest-800 transition-all duration-200 hover:translate-y-[-1px] text-sm"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop#categories"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-forest-950 border border-sand-300 font-semibold px-7 py-3.5 rounded-xl hover:bg-sand-100 transition-colors text-sm"
              >
                <span>EXPLORE COLLECTIONS</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-sand-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-charcoal-600 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                <span>100% Certified Organic</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-forest-700" />
                <span>Ayush & GMP Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-600" />
                <span>Free Delivery Above ₹499</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated border-8 border-white bg-sand-100">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85"
                alt="Herbal Life Organic Moringa and Botanical Herbs"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Floating Highlight Card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-sand-200 shadow-card flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sage-600">Featured Superfood</span>
                  <p className="font-serif font-bold text-xs sm:text-sm text-forest-950">Organic Moringa Superfood</p>
                  <p className="text-xs font-bold text-forest-800">₹449 <span className="text-[11px] text-charcoal-400 line-through">₹599</span></p>
                </div>
                <Link
                  href="/product/organic-moringa-powder"
                  className="bg-forest-900 text-cream-50 p-2.5 rounded-xl hover:bg-forest-800 transition-colors shadow-sm shrink-0"
                  aria-label="View product"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
