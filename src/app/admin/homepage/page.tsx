'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import {
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  Heart,
  HelpCircle,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { DEFAULT_WEBSITE_CONTENT } from '@/lib/db/content';

type TabKey =
  | 'hero'
  | 'trust_benefits'
  | 'categories'
  | 'bestsellers'
  | 'shop_by_need'
  | 'featured_split'
  | 'why_herbal_life'
  | 'reviews'
  | 'newsletter';

export default function AdminHomepageContentPage() {
  const { content, updateSection, resetSection, loading } = useWebsiteContent();

  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [formData, setFormData] = useState(content);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!loading) {
      setFormData(content);
    }
  }, [content, loading]);

  const handleSave = async (sectionKey: keyof typeof formData) => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await updateSection(sectionKey as any, formData[sectionKey]);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res.error || 'Failed to save changes.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (sectionKey: keyof typeof formData) => {
    if (confirm(`Reset "${sectionKey}" back to factory default?`)) {
      await resetSection(sectionKey as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'hero', label: '1. Hero Banner', icon: Sparkles },
    { key: 'trust_benefits', label: '2. Trust & Benefits Strip', icon: ShieldCheck },
    { key: 'categories', label: '3. Category Showcase', icon: Layers },
    { key: 'bestsellers', label: '4. Nature Bestsellers', icon: Heart },
    { key: 'shop_by_need', label: '5. Shop by Need', icon: Layers },
    { key: 'featured_split', label: '6. Featured Botanical Story', icon: Sparkles },
    { key: 'why_herbal_life', label: '7. Why Choose Us', icon: HelpCircle },
    { key: 'reviews', label: '8. Customer Reviews Header', icon: Heart },
    { key: 'newsletter', label: '9. Email Newsletter', icon: Mail },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Content Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Homepage Content Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Customize every heading, paragraph, button, image, and section visibility on the live homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Store</span>
          </a>
        </div>
      </div>

      {/* Save Success / Error Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Section saved successfully! Live store updated immediately.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold animate-fade-in">
          {saveError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-sand-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-forest-900 text-cream-50 shadow-sm'
                  : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO SECTION */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">Hero Banner Configuration</h3>
                <p className="text-xs text-charcoal-500">First impression area shown at the top of the homepage</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
                  <input
                    type="checkbox"
                    checked={formData.hero.is_enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, is_enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-forest-900 focus:ring-forest-700"
                  />
                  <span>Section Enabled</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleReset('hero')}
                  className="inline-flex items-center gap-1 text-xs text-charcoal-500 hover:text-forest-950 px-2.5 py-1 rounded-lg bg-sand-100 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Top Sparkle Badge Text</label>
                <input
                  type="text"
                  value={formData.hero.badge_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge_text: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Heading Line 1 (Regular)</label>
                <input
                  type="text"
                  value={formData.hero.heading_line1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, heading_line1: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Heading Line 2 (Highlighted Italic)</label>
                <input
                  type="text"
                  value={formData.hero.heading_line2_highlight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, heading_line2_highlight: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Hero Description Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.hero.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, description: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Primary Button Text</label>
                <input
                  type="text"
                  value={formData.hero.primary_btn_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, primary_btn_text: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Primary Button Link</label>
                <input
                  type="text"
                  value={formData.hero.primary_btn_link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, primary_btn_link: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Secondary Button Text</label>
                <input
                  type="text"
                  value={formData.hero.secondary_btn_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, secondary_btn_text: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Secondary Button Link</label>
                <input
                  type="text"
                  value={formData.hero.secondary_btn_link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, secondary_btn_link: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Trust Badge 1</label>
                <input
                  type="text"
                  value={formData.hero.badge1_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge1_text: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Trust Badge 2</label>
                <input
                  type="text"
                  value={formData.hero.badge2_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge2_text: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-950">Trust Badge 3</label>
                <input
                  type="text"
                  value={formData.hero.badge3_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge3_text: e.target.value },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>
            </div>

            {/* Hero Main Image */}
            <AdminImageUpload
              label="Hero Visual Image"
              description="High resolution portrait product or lifestyle visual (recommended: 1000x1250px)"
              currentImageUrl={formData.hero.hero_image}
              defaultImageUrl={DEFAULT_WEBSITE_CONTENT.hero.hero_image}
              aspectRatio="portrait"
              onChange={(newUrl) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, hero_image: newUrl },
                })
              }
            />

            {/* Floating Superfood Highlight Card */}
            <div className="p-5 rounded-2xl bg-sand-50 border border-sand-200 space-y-4">
              <h4 className="font-serif text-sm font-bold text-forest-950">
                Floating Superfood Highlight Overlay
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-charcoal-700">Card Tag</label>
                  <input
                    type="text"
                    value={formData.hero.hero_card_tag}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, hero_card_tag: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-charcoal-700">Product Title</label>
                  <input
                    type="text"
                    value={formData.hero.hero_card_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, hero_card_title: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-charcoal-700">Offer Price</label>
                  <input
                    type="text"
                    value={formData.hero.hero_card_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, hero_card_price: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-charcoal-700">Original Price</label>
                  <input
                    type="text"
                    value={formData.hero.hero_card_original_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, hero_card_original_price: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('hero')}
                className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-sage-300" />
                <span>{saving ? 'Saving...' : 'Save Hero Section Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRUST & BENEFITS */}
      {activeTab === 'trust_benefits' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Trust & Benefits Strip</h3>
              <p className="text-xs text-charcoal-500">4 trust indicators under the hero section</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.trust_benefits.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trust_benefits: { ...formData.trust_benefits, is_enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-forest-900 focus:ring-forest-700"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formData.trust_benefits.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-900 uppercase">Benefit Item #{idx + 1}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-700">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...formData.trust_benefits.items];
                        newItems[idx] = { ...newItems[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          trust_benefits: { ...formData.trust_benefits, items: newItems },
                        });
                      }}
                      className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-700">Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...formData.trust_benefits.items];
                        newItems[idx] = { ...newItems[idx], description: e.target.value };
                        setFormData({
                          ...formData,
                          trust_benefits: { ...formData.trust_benefits, items: newItems },
                        });
                      }}
                      className="w-full bg-white border border-sand-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('trust_benefits')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>{saving ? 'Saving...' : 'Save Benefits Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES HEADER */}
      {activeTab === 'categories' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Categories Section Header</h3>
              <p className="text-xs text-charcoal-500">Edit heading and subtitle for &ldquo;Shop by Category&rdquo;</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.categories_section.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories_section: {
                      ...formData.categories_section,
                      is_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Badge Tagline</label>
              <input
                type="text"
                value={formData.categories_section.badge_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories_section: {
                      ...formData.categories_section,
                      badge_text: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Section Heading</label>
              <input
                type="text"
                value={formData.categories_section.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories_section: {
                      ...formData.categories_section,
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Section Subtitle</label>
              <textarea
                rows={2}
                value={formData.categories_section.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories_section: {
                      ...formData.categories_section,
                      subtitle: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-forest-950 text-xs flex items-center justify-between">
            <span>To add, remove, or modify individual categories and their images:</span>
            <a
              href="/admin/categories"
              className="font-bold underline text-forest-900 hover:text-forest-700"
            >
              Go to Categories Manager →
            </a>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('categories_section')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Categories Section</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: BESTSELLERS */}
      {activeTab === 'bestsellers' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Nature&apos;s Best Sellers Section</h3>
              <p className="text-xs text-charcoal-500">Configure header and CTA button for best seller products grid</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.bestsellers_section.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bestsellers_section: {
                      ...formData.bestsellers_section,
                      is_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Badge Tagline</label>
              <input
                type="text"
                value={formData.bestsellers_section.badge_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bestsellers_section: {
                      ...formData.bestsellers_section,
                      badge_text: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Section Title</label>
              <input
                type="text"
                value={formData.bestsellers_section.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bestsellers_section: {
                      ...formData.bestsellers_section,
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-forest-950">Subtitle Description</label>
              <textarea
                rows={2}
                value={formData.bestsellers_section.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bestsellers_section: {
                      ...formData.bestsellers_section,
                      subtitle: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Button Label</label>
              <input
                type="text"
                value={formData.bestsellers_section.button_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bestsellers_section: {
                      ...formData.bestsellers_section,
                      button_text: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Button Link</label>
              <input
                type="text"
                value={formData.bestsellers_section.button_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bestsellers_section: {
                      ...formData.bestsellers_section,
                      button_link: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('bestsellers_section')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Best Sellers Section</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SHOP BY NEED */}
      {activeTab === 'shop_by_need' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Shop by Need Section</h3>
              <p className="text-xs text-charcoal-500">6 health goal cards (Immunity, Skin, Hair, Energy, Digestion, Sleep)</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.shop_by_need.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shop_by_need: {
                      ...formData.shop_by_need,
                      is_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Badge Tagline</label>
              <input
                type="text"
                value={formData.shop_by_need.badge_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shop_by_need: { ...formData.shop_by_need, badge_text: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Section Title</label>
              <input
                type="text"
                value={formData.shop_by_need.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shop_by_need: { ...formData.shop_by_need, heading: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-forest-950">Subtitle</label>
              <input
                type="text"
                value={formData.shop_by_need.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shop_by_need: { ...formData.shop_by_need, subtitle: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-sand-200">
            <h4 className="font-serif text-sm font-bold text-forest-950">Health Goal Solution Cards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.shop_by_need.items.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                  <span className="text-xs font-bold text-forest-900">Card #{idx + 1}</span>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-700">Goal Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...formData.shop_by_need.items];
                        newItems[idx] = { ...newItems[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          shop_by_need: { ...formData.shop_by_need, items: newItems },
                        });
                      }}
                      className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-700">Description</label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const newItems = [...formData.shop_by_need.items];
                        newItems[idx] = { ...newItems[idx], desc: e.target.value };
                        setFormData({
                          ...formData,
                          shop_by_need: { ...formData.shop_by_need, items: newItems },
                        });
                      }}
                      className="w-full bg-white border border-sand-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-700">Category Slug Link</label>
                    <input
                      type="text"
                      value={item.slug}
                      onChange={(e) => {
                        const newItems = [...formData.shop_by_need.items];
                        newItems[idx] = { ...newItems[idx], slug: e.target.value };
                        setFormData({
                          ...formData,
                          shop_by_need: { ...formData.shop_by_need, items: newItems },
                        });
                      }}
                      className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('shop_by_need')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Shop by Need Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: FEATURED SPLIT STORY */}
      {activeTab === 'featured_split' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Featured Botanical Story Section</h3>
              <p className="text-xs text-charcoal-500">About section banner with dark luxury herbal background</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.featured_split.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, is_enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-forest-950">Badge Tagline</label>
              <input
                type="text"
                value={formData.featured_split.badge_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, badge_text: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Heading Line 1</label>
              <input
                type="text"
                value={formData.featured_split.heading_line1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, heading_line1: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Heading Line 2 (Highlighted)</label>
              <input
                type="text"
                value={formData.featured_split.heading_line2_highlight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, heading_line2_highlight: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-forest-950">Description Paragraph</label>
              <textarea
                rows={3}
                value={formData.featured_split.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, description: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs"
              />
            </div>

            <div className="md:col-span-2 space-y-3 p-4 rounded-xl bg-sand-50 border border-sand-200">
              <h4 className="font-serif text-xs font-bold text-forest-950 uppercase">Key Value Bullets</h4>
              <div>
                <label className="text-[11px] font-bold text-charcoal-700">Bullet 1</label>
                <input
                  type="text"
                  value={formData.featured_split.bullet1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured_split: { ...formData.featured_split, bullet1: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-charcoal-700">Bullet 2</label>
                <input
                  type="text"
                  value={formData.featured_split.bullet2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured_split: { ...formData.featured_split, bullet2: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-charcoal-700">Bullet 3</label>
                <input
                  type="text"
                  value={formData.featured_split.bullet3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured_split: { ...formData.featured_split, bullet3: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-forest-950">Button Label</label>
              <input
                type="text"
                value={formData.featured_split.button_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, button_text: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Button Link</label>
              <input
                type="text"
                value={formData.featured_split.button_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, button_link: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <AdminImageUpload
            label="Story Showcase Image"
            description="Extraction / herbs laboratory aesthetic visual (recommended 1000x750px)"
            currentImageUrl={formData.featured_split.image_url}
            defaultImageUrl={DEFAULT_WEBSITE_CONTENT.featured_split.image_url}
            aspectRatio="video"
            onChange={(newUrl) =>
              setFormData({
                ...formData,
                featured_split: { ...formData.featured_split, image_url: newUrl },
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Image Overlay Tag</label>
              <input
                type="text"
                value={formData.featured_split.image_tag}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, image_tag: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Image Overlay Subtitle</label>
              <input
                type="text"
                value={formData.featured_split.image_tag_sub}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_split: { ...formData.featured_split, image_tag_sub: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('featured_split')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Featured Story Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: WHY CHOOSE US */}
      {activeTab === 'why_herbal_life' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Why Choose Mustafa Life Section</h3>
              <p className="text-xs text-charcoal-500">4 brand promise cards</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.why_herbal_life.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    why_herbal_life: { ...formData.why_herbal_life, is_enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Badge Tagline</label>
              <input
                type="text"
                value={formData.why_herbal_life.badge_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    why_herbal_life: { ...formData.why_herbal_life, badge_text: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Section Title</label>
              <input
                type="text"
                value={formData.why_herbal_life.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    why_herbal_life: { ...formData.why_herbal_life, heading: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-forest-950">Subtitle</label>
              <input
                type="text"
                value={formData.why_herbal_life.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    why_herbal_life: { ...formData.why_herbal_life, subtitle: e.target.value },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-sand-200">
            {formData.why_herbal_life.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                <span className="text-xs font-bold text-forest-900 uppercase">Reason #{idx + 1}</span>
                <div>
                  <label className="text-[11px] font-bold text-charcoal-700">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...formData.why_herbal_life.items];
                      newItems[idx] = { ...newItems[idx], title: e.target.value };
                      setFormData({
                        ...formData,
                        why_herbal_life: { ...formData.why_herbal_life, items: newItems },
                      });
                    }}
                    className="w-full bg-white border border-sand-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-charcoal-700">Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...formData.why_herbal_life.items];
                      newItems[idx] = { ...newItems[idx], description: e.target.value };
                      setFormData({
                        ...formData,
                        why_herbal_life: { ...formData.why_herbal_life, items: newItems },
                      });
                    }}
                    className="w-full bg-white border border-sand-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('why_herbal_life')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Why Choose Us</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: CUSTOMER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Customer Reviews Header</h3>
              <p className="text-xs text-charcoal-500">Configure title and subtitle of customer social proof</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.customer_reviews.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_reviews: {
                      ...formData.customer_reviews,
                      is_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Badge Tagline</label>
              <input
                type="text"
                value={formData.customer_reviews.badge_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_reviews: {
                      ...formData.customer_reviews,
                      badge_text: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Section Title</label>
              <input
                type="text"
                value={formData.customer_reviews.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_reviews: {
                      ...formData.customer_reviews,
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Subtitle</label>
              <textarea
                rows={2}
                value={formData.customer_reviews.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_reviews: {
                      ...formData.customer_reviews,
                      subtitle: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 text-forest-950 text-xs flex items-center justify-between">
            <span>To add, remove, and manage customer quotes, star ratings & names:</span>
            <a
              href="/admin/testimonials"
              className="font-bold underline text-forest-900 hover:text-forest-700"
            >
              Go to Testimonials Manager →
            </a>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('customer_reviews')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Reviews Header</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 9: NEWSLETTER */}
      {activeTab === 'newsletter' && (
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Newsletter Section</h3>
              <p className="text-xs text-charcoal-500">Email capture strip at bottom of homepage</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
              <input
                type="checkbox"
                checked={formData.newsletter_section.is_enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    newsletter_section: {
                      ...formData.newsletter_section,
                      is_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-forest-900"
              />
              <span>Section Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-forest-950">Heading</label>
              <input
                type="text"
                value={formData.newsletter_section.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    newsletter_section: {
                      ...formData.newsletter_section,
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-forest-950">Subtitle</label>
              <textarea
                rows={2}
                value={formData.newsletter_section.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    newsletter_section: {
                      ...formData.newsletter_section,
                      subtitle: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-forest-950">Button Label</label>
                <input
                  type="text"
                  value={formData.newsletter_section.button_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newsletter_section: {
                        ...formData.newsletter_section,
                        button_text: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-forest-950">Disclaimer Note</label>
                <input
                  type="text"
                  value={formData.newsletter_section.disclaimer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newsletter_section: {
                        ...formData.newsletter_section,
                        disclaimer: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('newsletter_section')}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-3 rounded-xl text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>Save Newsletter Section</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
