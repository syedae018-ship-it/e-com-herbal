import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Priya Sharma',
      location: 'Bengaluru',
      rating: 5,
      product: 'Organic Moringa Superfood Powder',
      comment:
        'The quality is unmatched! I mix a teaspoon into my morning smoothie every day and notice a clear, sustained boost in my energy without the midday crash.',
    },
    {
      name: 'Rohan Mehta',
      location: 'Mumbai',
      rating: 5,
      product: 'Herbal Immunity Tablets',
      comment:
        'Essential for changing weather. Since taking these Giloy & Amla tablets, my seasonal allergies are virtually gone. Truly authentic formulation with real herbs.',
    },
    {
      name: 'Ananya Iyer',
      location: 'Chennai',
      rating: 5,
      product: 'Pure Aloe Vera Gentle Cleanser',
      comment:
        'So soothing on my sensitive skin! Doesn\'t leave my face dry or tight like other cleansers. Truly authentic aloe texture with zero artificial fragrance.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-cream-50/70 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Real Stories, Real Wellness
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            Loved by Thousands Across India
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Read how Mustafa Life has become an indispensable part of daily wellness routines.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-7 rounded-2xl border border-sand-200 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-5 relative"
            >
              <Quote className="w-8 h-8 text-sage-200 absolute top-5 right-5 pointer-events-none" />

              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-forest-950">{review.name}</h4>
                  <p className="text-[11px] text-charcoal-400">{review.location}</p>
                  <p className="text-[10px] font-semibold text-sage-600 mt-0.5">
                    Verified: {review.product}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
