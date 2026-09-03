'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  onSubmit: (data: any, images: string[]) => Promise<{ success: boolean; error?: string }>;
  isEditing?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSubmit,
  isEditing = false,
}) => {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '');
  const [originalPrice, setOriginalPrice] = useState(
    initialData?.original_price ? String(initialData.original_price) : ''
  );
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : '50');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [benefits, setBenefits] = useState(initialData?.benefits || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || '');
  const [howToUse, setHowToUse] = useState(initialData?.how_to_use || '');

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP, or AVIF).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size exceeds limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max allowed size is 5 MB.`);
      return;
    }

    if (!isSupabaseConfigured() || !supabase) {
      const objectUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, objectUrl]);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setImages((prev) => [...prev, publicUrlData.publicUrl]);
      }
    } catch (err: any) {
      setErrorMessage(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setErrorMessage('Product title and price are required.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const productPayload = {
      name,
      slug: slug || slugify(name),
      short_description: shortDescription,
      description,
      category_id: categoryId || null,
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      stock: parseInt(stock) || 0,
      featured,
      is_active: isActive,
      benefits,
      ingredients,
      how_to_use: howToUse,
    };

    const res = await onSubmit(productPayload, images);
    setSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        isEditing
          ? 'Product details updated successfully.'
          : 'Product published to catalog successfully.'
      );
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } else {
      setErrorMessage(res.error || 'Failed to save product. Please check your form inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl font-admin-body">
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200/80 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Main Form Inputs */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Information Card */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="font-admin-heading text-sm font-semibold text-zinc-950 pb-2.5 border-b border-zinc-100">
              General Information
            </h2>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Neem & Tulsi Herbal Soap"
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="neem-tulsi-herbal-soap"
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Tagline / Brief Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Nutrient-dense superfood powder packed with vitamins and plant protein."
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Full Story & Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the botanical origin, extraction methods, bioactive compounds, and health benefits..."
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Ayurvedic Accordion Metadata */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="font-admin-heading text-sm font-semibold text-zinc-950 pb-2.5 border-b border-zinc-100">
              Botanical Details & Accordions
            </h2>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Key Benefits <span className="text-[11px] text-zinc-400 font-normal">(Separate points with semicolon ;)</span>
                </label>
                <textarea
                  rows={2}
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Boosts daily stamina; Strengthens immune defenses; 100% Raw & Vegan"
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Ingredients Formula
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Saponified Coconut Oil, Neem Leaf Extract, Tulsi Oil, Vegetable Glycerin."
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  How to Use / Usage Guidelines
                </label>
                <textarea
                  rows={2}
                  value={howToUse}
                  onChange={(e) => setHowToUse(e.target.value)}
                  placeholder="Lather with warm water between hands, gently massage skin, and rinse thoroughly."
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Product Gallery Imagery */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="font-admin-heading text-sm font-semibold text-zinc-950 pb-2.5 border-b border-zinc-100">
              Product Gallery Images
            </h2>

            <div className="space-y-4">
              {/* Add by URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste image URL (e.g. Unsplash or CDN link)..."
                  className="flex-1 bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-zinc-100 hover:bg-zinc-200/70 text-zinc-800 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors border border-zinc-200"
                >
                  Add URL
                </button>
              </div>

              {/* Upload File to Storage */}
              <div className="border border-dashed border-zinc-300 rounded-lg p-5 text-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                <input
                  type="file"
                  id="product-image-upload"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="product-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-xs">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-forest-800" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-zinc-800">
                    {uploading ? 'Uploading to Supabase storage...' : 'Click to upload product image'}
                  </div>
                  <p className="text-[11px] text-zinc-400">JPG, PNG, WebP up to 5MB</p>
                </label>
              </div>

              {/* Uploaded Images List */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100 aspect-square"
                    >
                      <Image
                        src={img}
                        alt={`Image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'up')}
                            className="p-1 rounded bg-white text-zinc-800 hover:bg-zinc-100"
                            title="Move left"
                          >
                            <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'down')}
                            className="p-1 rounded bg-white text-zinc-800 hover:bg-zinc-100"
                            title="Move right"
                          >
                            <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Pricing, Inventory, & Publication */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing & Stock Card */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="font-admin-heading text-sm font-semibold text-zinc-950 pb-2.5 border-b border-zinc-100">
              Pricing & Inventory
            </h2>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="499"
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 font-admin-heading tabular-nums focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Original / Strikethrough Price (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="699"
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 font-admin-heading tabular-nums focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  Current Stock Units <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-900 font-admin-heading tabular-nums focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                />
                <p className="text-[11px] text-zinc-400">
                  Below 15 triggers operational low-stock warning.
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-medium text-zinc-700">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Visibility & Organization */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3.5">
            <h2 className="font-admin-heading text-sm font-semibold text-zinc-950 pb-2.5 border-b border-zinc-100">
              Visibility & Publishing
            </h2>

            <label className="flex items-center gap-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-forest-800 border-zinc-300 focus:ring-forest-700"
              />
              <div>
                <span className="text-xs font-medium text-zinc-900 block">Active in Store</span>
                <span className="text-[11px] text-zinc-400 block">Visible for customers to buy</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-forest-800 border-zinc-300 focus:ring-forest-700"
              />
              <div>
                <span className="text-xs font-medium text-zinc-900 block">Featured Bestseller</span>
                <span className="text-[11px] text-zinc-400 block">Highlight on storefront homepage</span>
              </div>
            </label>

            <div className="pt-3 border-t border-zinc-100 space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-forest-900 text-white hover:bg-forest-800 font-medium px-4 py-2.5 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-800 py-1.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
