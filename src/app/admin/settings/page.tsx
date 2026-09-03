'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Truck,
  IndianRupee,
} from 'lucide-react';
import { DEFAULT_WEBSITE_CONTENT } from '@/lib/db/content';

export default function AdminSettingsPage() {
  const { content, updateSection, resetSection, loading } = useWebsiteContent();

  const [settings, setSettings] = useState(content.settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading) {
      setSettings(content.settings);
    }
  }, [content, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await updateSection('settings', settings);
      if (res.success) {
        setMessage({ type: 'success', text: 'Store settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update settings.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error occurred.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset general store settings to factory default?')) {
      await resetSection('settings');
      setMessage({ type: 'success', text: 'Settings restored to default!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Configuration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Website & Store Settings
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Configure brand name, support contacts, logistics thresholds, and currency.
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
        {/* Brand Information */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
            <Building className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">Brand Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">Store / Brand Name *</label>
              <input
                type="text"
                required
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">Brand Sub-Tagline</label>
              <input
                type="text"
                value={settings.site_tagline}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>

        {/* Customer Support Contact */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
            <Mail className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">Customer Support Info</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">Customer Care Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">Helpline Phone Number</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-200">
            <Truck className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">Commerce & Shipping Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-950">
                Free Delivery Minimum Threshold (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700 font-mono"
              />
              <p className="text-[11px] text-charcoal-400">
                Orders with subtotal at or above this amount automatically receive free delivery.
              </p>
            </div>
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
            <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
