'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Quote,
  Sparkles,
  Heart,
  Volume2,
  MessageSquare,
} from 'lucide-react';
import { DEFAULT_WEBSITE_CONTENT } from '@/lib/db/content';

export default function AdminTaglinesPage() {
  const { content, updateSection, resetSection, loading } = useWebsiteContent();

  const [settings, setSettings] = useState(content.settings);
  const [hero, setHero] = useState(content.hero);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState('');

  useEffect(() => {
    if (!loading) {
      setSettings(content.settings);
      setHero(content.hero);
    }
  }, [content, loading]);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const [res1, res2] = await Promise.all([
        updateSection('settings', settings),
        updateSection('hero', hero),
      ]);

      if (res1.success && res2.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res1.error || res2.error || 'Failed to save taglines.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setSettings((prev) => ({
      ...prev,
      announcements: [...prev.announcements, newAnnouncement.trim()],
    }));
    setNewAnnouncement('');
  };

  const handleRemoveAnnouncement = (idx: number) => {
    setSettings((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== idx),
    }));
  };

  const handleResetTaglines = async () => {
    if (confirm('Reset all taglines and messages back to factory default?')) {
      await Promise.all([resetSection('settings'), resetSection('hero')]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Brand Messaging
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Taglines & Website Content
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage all taglines, slogans, wellness statements, and promo announcements across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetTaglines}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Defaults</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-sage-300" />
            <span>{saving ? 'Saving...' : 'Save All Taglines'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Taglines and messaging updated successfully across the website!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold animate-fade-in">
          {saveError}
        </div>
      )}

      {/* Brand & Hero Taglines */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
          <Sparkles className="w-5 h-5 text-forest-700" />
          <h3 className="font-serif text-base font-bold text-forest-950">
            Primary Brand & Hero Taglines
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Main Website Tagline</label>
            <input
              type="text"
              value={settings.site_tagline}
              onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              placeholder="Naturally Better. Everyday."
            />
            <p className="text-[11px] text-charcoal-400">Displayed below the logo in the header and footer.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Hero Section Tagline</label>
            <input
              type="text"
              value={hero.badge_text}
              onChange={(e) => setHero({ ...hero, badge_text: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              placeholder="Pure Wellness, Powered by Nature"
            />
            <p className="text-[11px] text-charcoal-400">Displayed in the badge pill above the main hero heading.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Promotional Tagline</label>
            <input
              type="text"
              value={settings.promotional_tagline}
              onChange={(e) => setSettings({ ...settings, promotional_tagline: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              placeholder="Ayurvedic Heritage with Modern Purity"
            />
            <p className="text-[11px] text-charcoal-400">Used for marketing callouts and promo banners.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Product Craftsmanship Tagline</label>
            <input
              type="text"
              value={settings.product_tagline}
              onChange={(e) => setSettings({ ...settings, product_tagline: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              placeholder="Fresh Small Batches Handcrafted for Maximum Potency"
            />
            <p className="text-[11px] text-charcoal-400">Product quality and manufacturing promise.</p>
          </div>
        </div>
      </div>

      {/* Wellness & Welcome Messages */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
          <Heart className="w-5 h-5 text-forest-700" />
          <h3 className="font-serif text-base font-bold text-forest-950">
            Health, Wellness & Welcome Messages
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Welcome Greeting Message</label>
            <input
              type="text"
              value={settings.welcome_message}
              onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Health & Wellness Core Philosophy</label>
            <textarea
              rows={2}
              value={settings.health_wellness_message}
              onChange={(e) => setSettings({ ...settings, health_wellness_message: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950">Call-to-Action Message</label>
            <input
              type="text"
              value={settings.cta_message}
              onChange={(e) => setSettings({ ...settings, cta_message: e.target.value })}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>
        </div>
      </div>

      {/* Rotating Header Announcement Bar */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-forest-700" />
            <div>
              <h3 className="font-serif text-base font-bold text-forest-950">
                Top Announcement Bar Rotating Messages
              </h3>
              <p className="text-xs text-charcoal-500">Messages rotate every 4 seconds in the top header strip</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
            <input
              type="checkbox"
              checked={settings.announcement_bar_enabled}
              onChange={(e) =>
                setSettings({ ...settings, announcement_bar_enabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-forest-900"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div className="space-y-3">
          {settings.announcements.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-charcoal-400">#{idx + 1}</span>
              <input
                type="text"
                value={msg}
                onChange={(e) => {
                  const updated = [...settings.announcements];
                  updated[idx] = e.target.value;
                  setSettings({ ...settings, announcements: updated });
                }}
                className="flex-1 bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
              <button
                type="button"
                onClick={() => handleRemoveAnnouncement(idx)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add New Announcement */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Type new announcement message (e.g., Use code HERBAL15 for 15% off)..."
              className="flex-1 bg-white border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
            <button
              type="button"
              onClick={handleAddAnnouncement}
              className="inline-flex items-center gap-1.5 bg-forest-900 text-cream-50 font-bold px-4 py-2 rounded-xl text-xs hover:bg-forest-800 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-sage-300" />
          <span>{saving ? 'Saving Taglines...' : 'Save All Tagline Changes'}</span>
        </button>
      </div>
    </div>
  );
}
