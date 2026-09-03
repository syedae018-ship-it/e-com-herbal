'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { DEFAULT_WEBSITE_CONTENT } from '@/lib/db/content';
import {
  Save,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Layers,
  Shield,
  Eye,
} from 'lucide-react';
import { getCategories, updateCategory } from '@/lib/db/categories';
import { Category } from '@/lib/types';

export default function AdminImageManagementPage() {
  const { content, updateSection, resetSection, loading } = useWebsiteContent();

  const [heroImage, setHeroImage] = useState(content.hero.hero_image);
  const [featuredImage, setFeaturedImage] = useState(content.featured_split.image_url);
  const [logoUrl, setLogoUrl] = useState(content.settings.logo_url);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!loading) {
      setHeroImage(content.hero.hero_image);
      setFeaturedImage(content.featured_split.image_url);
      setLogoUrl(content.settings.logo_url);
    }
  }, [content, loading]);

  useEffect(() => {
    async function loadCats() {
      const cats = await getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const [res1, res2, res3] = await Promise.all([
        updateSection('hero', { ...content.hero, hero_image: heroImage }),
        updateSection('featured_split', { ...content.featured_split, image_url: featuredImage }),
        updateSection('settings', { ...content.settings, logo_url: logoUrl }),
      ]);

      if (res1.success && res2.success && res3.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to save image changes.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryImgChange = async (cat: Category, newUrl: string) => {
    const updated = { ...cat, image_url: newUrl };
    await updateCategory(cat.id, updated);
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? updated : c)));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Asset Library
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Image Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Central visual control for every image, hero showcase, banner, logo, and collection across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </a>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-sage-300" />
            <span>{saving ? 'Saving...' : 'Save All Image Changes'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Image assets updated successfully! Refreshing live store.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold animate-fade-in">
          {saveError}
        </div>
      )}

      {/* 1. Hero Showcase Image */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-forest-700" />
          <h3 className="font-serif text-base font-bold text-forest-950">1. Hero Section Showcase Visual</h3>
        </div>
        <AdminImageUpload
          label="Hero Banner Image"
          description="Main hero portrait image displayed on the right side of the homepage hero banner."
          currentImageUrl={heroImage}
          defaultImageUrl={DEFAULT_WEBSITE_CONTENT.hero.hero_image}
          aspectRatio="portrait"
          onChange={setHeroImage}
        />
      </div>

      {/* 2. Featured Botanical Story Section Image */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-forest-700" />
          <h3 className="font-serif text-base font-bold text-forest-950">2. Featured Botanical Story Image</h3>
        </div>
        <AdminImageUpload
          label="Extraction Laboratory Visual"
          description="Dark luxury background story section visual displaying laboratory extraction and whole herbs."
          currentImageUrl={featuredImage}
          defaultImageUrl={DEFAULT_WEBSITE_CONTENT.featured_split.image_url}
          aspectRatio="video"
          onChange={setFeaturedImage}
        />
      </div>

      {/* 3. Brand Logo */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-forest-700" />
          <h3 className="font-serif text-base font-bold text-forest-950">3. Brand Logo (Optional Custom Graphic)</h3>
        </div>
        <AdminImageUpload
          label="Header & Footer Logo"
          description="Leave empty to use the default luxury typography and botanical leaf emblem, or upload a custom brand logo image."
          currentImageUrl={logoUrl}
          defaultImageUrl=""
          aspectRatio="square"
          onChange={setLogoUrl}
        />
      </div>

      {/* 4. Category Collection Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-sand-200">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-700" />
            <h3 className="font-serif text-base font-bold text-forest-950">4. Category Showcase Images</h3>
          </div>
          <span className="text-xs text-charcoal-500">{categories.length} Categories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <AdminImageUpload
              key={cat.id}
              label={`${cat.name} Card Visual`}
              description={`URL: /category/${cat.slug}`}
              currentImageUrl={cat.image_url || ''}
              defaultImageUrl="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
              aspectRatio="video"
              onChange={(newUrl) => handleCategoryImgChange(cat, newUrl)}
            />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-sage-300" />
          <span>{saving ? 'Saving...' : 'Save All Image Changes'}</span>
        </button>
      </div>
    </div>
  );
}
