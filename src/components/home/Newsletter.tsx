'use client';

import React, { useState } from 'react';
import { subscribeNewsletter } from '@/lib/db/newsletter';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

export const Newsletter: React.FC = () => {
  const { content } = useWebsiteContent();
  const section = content.newsletter_section;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (section.is_enabled === false) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    const res = await subscribeNewsletter(email);
    setLoading(false);

    if (res.success) {
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-forest-900 text-cream-50 relative overflow-hidden">
      {/* Decorative leaf backdrop pattern */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6 relative z-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-forest-800 border border-forest-700 mx-auto flex items-center justify-center text-sage-300">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {section.heading}
          </h2>
          <p className="text-xs sm:text-sm text-sage-200/90 max-w-md mx-auto leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            className="flex-1 bg-forest-950/60 border border-forest-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cream-100 text-forest-950 hover:bg-white font-bold px-6 py-3 rounded-xl transition-all duration-200 text-xs sm:text-sm disabled:opacity-50 shrink-0 shadow-md"
          >
            {loading ? 'Subscribing...' : section.button_text || 'Subscribe'}
          </button>
        </form>

        {status && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium animate-fade-in ${
              status.type === 'success'
                ? 'bg-emerald-900/60 border border-emerald-700 text-emerald-200'
                : 'bg-rose-900/60 border border-rose-700 text-rose-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <p className="text-[10px] sm:text-[11px] text-forest-400">
          {section.disclaimer || 'No spam, ever. Unsubscribe at any time with a single click.'}
        </p>
      </div>
    </section>
  );
};

