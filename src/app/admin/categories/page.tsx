'use client';

import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/db/categories';
import { Category } from '@/lib/types';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { slugify } from '@/lib/utils';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Check,
} from 'lucide-react';
import Image from 'next/image';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleStartCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('/images/fallback.svg');
    setIsActive(true);
    setIsCreating(true);
  };

  const handleStartEdit = (cat: Category) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setIsActive(cat.is_active ?? true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (isCreating || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      if (isCreating) {
        const res = await createCategory({
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim(),
          image_url: imageUrl,
          is_active: isActive,
        });

        if (res.success) {
          setMessage({ type: 'success', text: 'Category created successfully!' });
          setIsCreating(false);
          await loadCategories();
        } else {
          setMessage({ type: 'error', text: res.error || 'Failed to create category.' });
        }
      } else if (editingCategory) {
        const res = await updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          image_url: imageUrl,
          is_active: isActive,
        });

        if (res.success) {
          setMessage({ type: 'success', text: 'Category updated successfully!' });
          setEditingCategory(null);
          await loadCategories();
        } else {
          setMessage({ type: 'error', text: res.error || 'Failed to update category.' });
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const res = await deleteCategory(id);
      if (res.success) {
        setMessage({ type: 'success', text: 'Category removed.' });
        await loadCategories();
      } else {
        setMessage({ type: 'error', text: res.error || 'Could not delete category.' });
      }
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Catalog Structure
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Category Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Organize products into botanical collections, customize banner imagery, and adjust descriptions.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
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

      {/* Create / Edit Form Modal/Drawer */}
      {(isCreating || editingCategory) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border-2 border-forest-800/30 shadow-lg space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <h3 className="font-serif text-base font-bold text-forest-950">
              {isCreating ? 'Create New Category' : `Edit Category: ${editingCategory?.name}`}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 text-charcoal-400 hover:text-charcoal-800 rounded-lg hover:bg-sand-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Herbal Wellness"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. herbal-wellness"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700 font-mono"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-forest-950">Short Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description for category card..."
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="md:col-span-2">
              <AdminImageUpload
                label="Category Showcase Image"
                description="Visual card image shown on the homepage and catalog"
                currentImageUrl={imageUrl}
                aspectRatio="video"
                onChange={setImageUrl}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-900 focus:ring-forest-700"
                />
                <span>Active in Catalog & Navigation</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-sand-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-sage-300" />
              <span>{saving ? 'Saving...' : isCreating ? 'Create Category' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-charcoal-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal-500">No categories found.</div>
        ) : (
          <div className="divide-y divide-sand-200">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-sand-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-sand-100 border border-sand-200 shrink-0">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <Layers className="w-6 h-6 m-auto text-charcoal-300" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm font-bold text-forest-950">{cat.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cat.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-charcoal-100 text-charcoal-600'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500 line-clamp-1">{cat.description}</p>
                    <p className="text-[11px] font-mono text-sage-600">/category/{cat.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-forest-900 bg-sand-100 hover:bg-sand-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
