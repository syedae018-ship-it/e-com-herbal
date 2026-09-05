'use client';

import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

export const CustomerReviews: React.FC = () => {
  const { content } = useWebsiteContent();
  const section = content.customer_reviews;

  if (section.is_enabled === false) {
    return null;
  }

  const activeReviews = section.items.filter((r) => r.is_active !== false);

  return (
    <section className="py-12 sm:py-24 bg-cream-50/70 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {section.badge_text && (
            <span className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-sage-600">
              {section.badge_text}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            {section.heading}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            {section.subtitle || 'Read how Nutri Life has become an indispensable part of daily wellness routines.'}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {activeReviews.map((review, index) => (
            <div
              key={review.id || index}
              className="bg-white p-5 sm:p-7 rounded-2xl border border-sand-200 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-5 relative"
            >
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-sage-200 absolute top-4 sm:top-5 right-4 sm:right-5 pointer-events-none" />

              <div className="space-y-2.5 sm:space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-sand-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-forest-950">{review.customer_name}</h4>
                  <p className="text-[10px] sm:text-[11px] text-charcoal-400">{review.location}</p>
                  {review.product_id && (
                    <p className="text-[9px] sm:text-[10px] font-semibold text-sage-600 mt-0.5">
                      Verified: {review.product_id}
                    </p>
                  )}
                </div>
                {review.verified_purchase !== false && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Buyer</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

