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
  Package,
  Search,
  Upload,
  Link as LinkIcon,
  Trash2,
  Leaf,
  Check,
} from 'lucide-react';
import { getCategories, updateCategory } from '@/lib/db/categories';
import { getAllProductsAdmin, updateProduct, resetProductImage, resetAllProductImagesToSeed } from '@/lib/db/products';
import { Category, Product } from '@/lib/types';
import { SEED_CATEGORIES } from '@/lib/seed-data';
import Image from 'next/image';

export default function AdminImageManagementPage() {
  const { content, updateSection, loading } = useWebsiteContent();

  const [activeTab, setActiveTab] = useState<'products' | 'banners' | 'categories'>('products');
  const [heroImage, setHeroImage] = useState(content.hero.hero_image);
  const [featuredImage, setFeaturedImage] = useState(content.featured_split.image_url);
  const [logoUrl, setLogoUrl] = useState(content.settings.logo_url);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!loading) {
      setHeroImage(content.hero.hero_image);
      setFeaturedImage(content.featured_split.image_url);
      setLogoUrl(content.settings.logo_url);
    }
  }, [content, loading]);

  useEffect(() => {
    async function loadData() {
      const [cats, prods] = await Promise.all([
        getCategories(),
        getAllProductsAdmin(),
      ]);
      setCategories(cats);
      setProducts(prods);
    }
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('nutri_life_products_updated', handleUpdate);
    return () => window.removeEventListener('nutri_life_products_updated', handleUpdate);
  }, []);

  const handleSaveBanners = async () => {
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const [res1, res2, res3] = await Promise.all([
        updateSection('hero', { ...content.hero, hero_image: heroImage }),
        updateSection('featured_split', { ...content.featured_split, image_url: featuredImage }),
        updateSection('settings', { ...content.settings, logo_url: logoUrl }),
      ]);

      if (res1.success && res2.success && res3.success) {
        setSaveSuccess('Banner and logo assets updated successfully!');
        setTimeout(() => setSaveSuccess(''), 3500);
      } else {
        setSaveError('Failed to save banner changes.');
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
    setSaveSuccess(`Category "${cat.name}" image updated!`);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleProductImageChange = async (productId: string, newImageUrl: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const newImages = newImageUrl ? [newImageUrl] : [];
    const res = await updateProduct(productId, {}, newImages);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, images: newImages } : p))
      );
      setSaveSuccess(`Product "${target.name}" image updated!`);
      setTimeout(() => setSaveSuccess(''), 3000);
    } else {
      setSaveError(res.error || 'Failed to update product image.');
    }
  };

  const handleResetProductImage = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const res = await resetProductImage(productId);
    if (res.success && res.defaultImages) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, images: res.defaultImages || [] } : p))
      );
      setSaveSuccess(`Restored curated herb image for "${target.name}"!`);
      setTimeout(() => setSaveSuccess(''), 3000);
    }
  };

  const handleResetAllProductsToBotanical = async () => {
    setSaving(true);
    const res = await resetAllProductImagesToSeed();
    setSaving(false);
    if (res.success) {
      const refreshed = await getAllProductsAdmin();
      setProducts(refreshed);
      setSaveSuccess(`Successfully updated all ${res.count} products with authentic herbal botanical images!`);
      setTimeout(() => setSaveSuccess(''), 4000);
    } else {
      setSaveError(res.error || 'Failed to update all product images.');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.ingredients && p.ingredients.toLowerCase().includes(productSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl pb-24 font-admin-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
              Visual Asset Manager
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Live Sync
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">
            Image Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5 max-w-2xl">
            Manage, replace, and upload high-resolution images for every herbal product, category card, hero banner, and brand asset across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </a>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            Live Synchronized
          </span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold animate-fade-in">
          {saveError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-sand-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-forest-900 text-cream-50 shadow-sm'
              : 'text-charcoal-600 hover:text-forest-900 hover:bg-sand-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Images ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'banners'
              ? 'bg-forest-900 text-cream-50 shadow-sm'
              : 'text-charcoal-600 hover:text-forest-900 hover:bg-sand-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero & Story Banners</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-forest-900 text-cream-50 shadow-sm'
              : 'text-charcoal-600 hover:text-forest-900 hover:bg-sand-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Category Cards ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT IMAGES */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-50 p-4 rounded-2xl border border-sand-200">
            <div>
              <h3 className="font-serif text-base font-bold text-forest-950">
                Herbal Product Image Library
              </h3>
              <p className="text-xs text-charcoal-500">
                Replace or upload images for each individual product. Images automatically reflect on Homepage, Shop, Product Details, and Cart.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetAllProductsToBotanical}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-forest-900 text-cream-50 hover:bg-forest-800 transition-colors shadow-sm disabled:opacity-50 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-sage-300" />
                <span>Sync All to Botanical Images</span>
              </button>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products, herbs..."
                  className="w-full bg-white border border-sand-300 rounded-xl px-3.5 py-2 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const currentImg = product.images?.[0] || '';

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-sand-200 p-5 shadow-sm hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 block">
                          {product.category?.name || 'Herbal Collection'}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-forest-950 leading-snug mt-0.5">
                          {product.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 border border-emerald-200">
                        ₹{product.price}
                      </span>
                    </div>

                    {/* Image Preview Area */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-sand-100 border border-sand-200 group">
                      {currentImg ? (
                        <Image
                          src={currentImg}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 gap-1">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[10px]">No image assigned</span>
                        </div>
                      )}

                      {/* Floating View Link */}
                      <a
                        href={`/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Page</span>
                      </a>
                    </div>

                    {/* Herbal Ingredients summary */}
                    {product.ingredients && (
                      <p className="text-[11px] text-charcoal-500 line-clamp-1 italic">
                        🌿 {product.ingredients}
                      </p>
                    )}
                  </div>

                  {/* Image Controls Component */}
                  <div className="space-y-2 pt-3 border-t border-sand-100">
                    <AdminImageUpload
                      label="Product Photo"
                      description="Upload a new high-resolution photo or paste an image URL."
                      currentImageUrl={currentImg}
                      aspectRatio="video"
                      onChange={(newUrl) => handleProductImageChange(product.id, newUrl)}
                    />

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleResetProductImage(product.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-charcoal-500 hover:text-forest-900 transition-colors font-medium"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Curated Herb Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: HERO & STORY BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-8 animate-fade-in">
          {/* 1. Hero Showcase Image */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-base font-bold text-forest-950">
                1. Hero Section Showcase Visual
              </h3>
            </div>
            <AdminImageUpload
              label="Hero Banner Portrait Image"
              description="Main hero image displayed prominently on the right side of the homepage hero banner."
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
              <h3 className="font-serif text-base font-bold text-forest-950">
                2. Featured Botanical Story Image
              </h3>
            </div>
            <AdminImageUpload
              label="Extraction Laboratory & Herb Visual"
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
              <h3 className="font-serif text-base font-bold text-forest-950">
                3. Brand Logo (Optional Custom Graphic)
              </h3>
            </div>
            <AdminImageUpload
              label="Header & Footer Logo"
              description="Leave empty to use the luxury typography and botanical leaf emblem, or upload a custom logo."
              currentImageUrl={logoUrl}
              defaultImageUrl=""
              aspectRatio="square"
              onChange={setLogoUrl}
            />
          </div>

          {/* Save Banners Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveBanners}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-sage-300" />
              <span>{saving ? 'Saving...' : 'Save Banner Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY CARDS */}
      {activeTab === 'categories' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-sand-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-base font-bold text-forest-950">
                Category Collection Images
              </h3>
            </div>
            <span className="text-xs text-charcoal-500">{categories.length} Collections</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <AdminImageUpload
                key={cat.id}
                label={`${cat.name} Card Visual`}
                description={`Collection Route: /category/${cat.slug}`}
                currentImageUrl={cat.image_url || ''}
                defaultImageUrl={SEED_CATEGORIES.find((s) => s.id === cat.id || s.slug === cat.slug)?.image_url || '/images/fallback.svg'}
                aspectRatio="video"
                onChange={(newUrl) => handleCategoryImgChange(cat, newUrl)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
