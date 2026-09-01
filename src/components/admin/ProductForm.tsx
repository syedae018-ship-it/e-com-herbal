'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Upload, X, Plus, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
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

  // Upload to Supabase Storage with size and MIME validation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');

    // 1. Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP, or AVIF).');
      return;
    }

    // 2. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    if (!isSupabaseConfigured() || !supabase) {
      // Local demo mode: create temporary object URL
      const objectUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, objectUrl]);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setImages((prev) => [...prev, publicUrlData.publicUrl]);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to upload image: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setErrorMessage('Product name and price are required.');
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
          ? 'Product updated successfully!'
          : 'Product created and added to catalog successfully!'
      );
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Failed to save product. Please check your inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Information */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 pb-3 border-b border-sand-100">
              Basic Product Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Organic Moringa Powder"
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. organic-moringa-powder"
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 font-mono focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Short Tagline / Subtitle *
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Nutrient-dense superfood for vitality and daily stamina."
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Full Story & Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the botanical origin, purity, and overall wellness benefits..."
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>
            </div>
          </div>

          {/* Accordion Content Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 pb-3 border-b border-sand-100">
              Wellness Tabs & Product Accordions
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Key Benefits (Separate points with semicolon ;)
                </label>
                <textarea
                  rows={3}
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Boosts energy; Supports immune defense; 100% Raw & Vegan"
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Full Ingredients List
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="100% Certified Pure Organic Moringa Leaf (Moringa oleifera) Powder."
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  How to Use / Recommended Dosage
                </label>
                <textarea
                  rows={2}
                  value={howToUse}
                  onChange={(e) => setHowToUse(e.target.value)}
                  placeholder="Mix 1 teaspoon into warm water or green smoothie daily."
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>
            </div>
          </div>

          {/* Product Media Gallery */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 pb-3 border-b border-sand-100">
              Product Images
            </h3>

            {/* Upload Area */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-sand-300 rounded-2xl p-6 text-center hover:border-forest-700 transition-colors bg-sand-50/40">
                <input
                  type="file"
                  id="product-image-upload"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="product-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-sage-100 text-forest-900 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-forest-800" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-forest-950 block">
                      {uploading ? 'Uploading to Supabase Storage...' : 'Click to Upload High-Res Image'}
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      Supports JPG, PNG, WebP, AVIF up to 5 MB
                    </span>
                  </div>
                </label>
              </div>

              {/* Or add Image URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste external image URL (e.g. Unsplash)..."
                  className="flex-1 bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-forest-900 text-cream-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-forest-800 transition-colors"
                >
                  Add URL
                </button>
              </div>

              {/* Uploaded Thumbnails with Reordering */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-sand-100 border border-sand-300 shadow-sm"
                    >
                      <Image
                        src={url}
                        alt={`Product image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 bg-forest-900 text-cream-50 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Cover
                        </div>
                      )}
                      
                      {/* Image Action Controls */}
                      <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'up')}
                            className="w-7 h-7 bg-white/90 text-charcoal-800 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            title="Move Earlier"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'down')}
                            className="w-7 h-7 bg-white/90 text-charcoal-800 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            title="Move Later"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center hover:bg-rose-700 transition-colors"
                          title="Remove Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Category, Status & Save CTA */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          {/* Inventory & Pricing */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 pb-3 border-b border-sand-100">
              Pricing & Stock
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Sale Price (₹ INR) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="449"
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 font-bold focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Original MRP (₹ INR)
                </label>
                <input
                  type="number"
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="599"
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Stock Units in Inventory *
                </label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Visibility & Badges */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 pb-3 border-b border-sand-100">
              Visibility Settings
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-forest-900 rounded focus:ring-forest-700"
                />
                <span className="text-xs font-bold text-charcoal-800">
                  Active in Catalog (Visible to customers)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-forest-900 rounded focus:ring-forest-700"
                />
                <span className="text-xs font-bold text-charcoal-800">
                  Showcase in Nature&apos;s Best Sellers (Homepage)
                </span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Publish Product to Catalog'}</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="w-full bg-sand-100 hover:bg-sand-200 text-forest-950 font-semibold py-2.5 px-4 rounded-xl transition-colors text-xs text-center"
            >
              Cancel & Back to Products
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
