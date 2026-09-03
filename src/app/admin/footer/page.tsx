'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import {
  PanelBottom,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Share2,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { DEFAULT_WEBSITE_CONTENT } from '@/lib/db/content';

export default function AdminFooterPage() {
  const { content, updateSection, resetSection, loading } = useWebsiteContent();

  const [footer, setFooter] = useState(content.footer);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading) {
      setFooter(content.footer);
    }
  }, [content, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await updateSection('footer', footer);
      if (res.success) {
        setMessage({ type: 'success', text: 'Footer content updated successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update footer.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error occurred.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset footer settings to factory default?')) {
      await resetSection('footer');
      setMessage({ type: 'success', text: 'Footer restored to default!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Footer Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Footer & Social Settings
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Customize footer description, social media profiles, trust badges, and copyright notice.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Blurb & Copyright */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
            <FileText className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">
              About Blurb & Copyright Text
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">About Brand Blurb Paragraph</label>
              <textarea
                rows={3}
                value={footer.about_text}
                onChange={(e) => setFooter({ ...footer, about_text: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">Copyright Line</label>
              <input
                type="text"
                value={footer.copyright_text}
                onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">Customer Care Email Display</label>
              <input
                type="email"
                value={footer.care_email}
                onChange={(e) => setFooter({ ...footer, care_email: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
            <Share2 className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">Social Media URLs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">Instagram URL</label>
              <input
                type="url"
                value={footer.instagram_url}
                onChange={(e) => setFooter({ ...footer, instagram_url: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">Facebook URL</label>
              <input
                type="url"
                value={footer.facebook_url}
                onChange={(e) => setFooter({ ...footer, facebook_url: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">Twitter / X URL</label>
              <input
                type="url"
                value={footer.twitter_url}
                onChange={(e) => setFooter({ ...footer, twitter_url: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">YouTube Channel URL</label>
              <input
                type="url"
                value={footer.youtube_url}
                onChange={(e) => setFooter({ ...footer, youtube_url: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>

        {/* Footer Top Trust Badges */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
            <ShieldCheck className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">
              Footer Trust Strip Badges (4 Items)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {footer.trust_badges.map((badge, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                <span className="text-xs font-bold text-forest-900 uppercase">Trust Badge #{idx + 1}</span>
                <div>
                  <label className="text-[11px] font-bold text-charcoal-700">Title</label>
                  <input
                    type="text"
                    value={badge.title}
                    onChange={(e) => {
                      const newBadges = [...footer.trust_badges];
                      newBadges[idx] = { ...newBadges[idx], title: e.target.value };
                      setFooter({ ...footer, trust_badges: newBadges });
                    }}
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-charcoal-700">Description</label>
                  <input
                    type="text"
                    value={badge.description}
                    onChange={(e) => {
                      const newBadges = [...footer.trust_badges];
                      newBadges[idx] = { ...newBadges[idx], description: e.target.value };
                      setFooter({ ...footer, trust_badges: newBadges });
                    }}
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-sage-300" />
            <span>{saving ? 'Saving Footer...' : 'Save Footer Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
