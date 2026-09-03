'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import { Review } from '@/lib/types';
import {
  MessageSquareQuote,
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_WEBSITE_CONTENT } from '@/lib/db/content';

export default function AdminTestimonialsPage() {
  const { content, updateSection, resetSection, loading } = useWebsiteContent();

  const [reviews, setReviews] = useState<Review[]>(content.customer_reviews.items);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [product, setProduct] = useState('');
  const [comment, setComment] = useState('');
  const [verified, setVerified] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading) {
      setReviews(content.customer_reviews.items);
    }
  }, [content, loading]);

  const handleStartCreate = () => {
    setEditingReview(null);
    setCustomerName('');
    setLocation('Bengaluru');
    setRating(5);
    setProduct('Organic Moringa Superfood Powder');
    setComment('');
    setVerified(true);
    setIsActive(true);
    setIsCreating(true);
  };

  const handleStartEdit = (rev: Review) => {
    setIsCreating(false);
    setEditingReview(rev);
    setCustomerName(rev.customer_name);
    setLocation(rev.location || '');
    setRating(rev.rating);
    setProduct(rev.product_id || '');
    setComment(rev.comment);
    setVerified(rev.verified_purchase);
    setIsActive(rev.is_active ?? true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingReview(null);
  };

  const handleSaveReviews = async (updatedList: Review[]) => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await updateSection('customer_reviews', {
        ...content.customer_reviews,
        items: updatedList,
      });

      if (res.success) {
        setReviews(updatedList);
        setMessage({ type: 'success', text: 'Reviews saved and published!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save reviews.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error occurred.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    if (isCreating) {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        customer_name: customerName.trim(),
        location: location.trim(),
        rating,
        product_id: product.trim(),
        comment: comment.trim(),
        verified_purchase: verified,
        is_active: isActive,
        created_at: new Date().toISOString(),
      };
      const updated = [newReview, ...reviews];
      await handleSaveReviews(updated);
      setIsCreating(false);
    } else if (editingReview) {
      const updated = reviews.map((r) =>
        r.id === editingReview.id
          ? {
              ...r,
              customer_name: customerName.trim(),
              location: location.trim(),
              rating,
              product_id: product.trim(),
              comment: comment.trim(),
              verified_purchase: verified,
              is_active: isActive,
            }
          : r
      );
      await handleSaveReviews(updated);
      setEditingReview(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      const updated = reviews.filter((r) => r.id !== id);
      await handleSaveReviews(updated);
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset testimonials to default factory reviews?')) {
      await resetSection('customer_reviews');
      setMessage({ type: 'success', text: 'Restored default reviews!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Social Proof
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Testimonials & Customer Reviews
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage genuine customer feedback, 5-star ratings, and product testimonials displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
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

      {/* Add / Edit Form Modal */}
      {(isCreating || editingReview) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border-2 border-forest-800/30 shadow-lg space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <h3 className="font-serif text-base font-bold text-forest-950">
              {isCreating ? 'Add Customer Review' : `Edit Review by ${editingReview?.customer_name}`}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 text-charcoal-400 hover:text-charcoal-800 rounded-lg hover:bg-sand-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">City / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-950">Rating (Stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-forest-950">Product Name / Verified Item</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Organic Moringa Superfood Powder"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-forest-950">Review Comment *</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write customer feedback quote here..."
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-900 focus:ring-forest-700"
                />
                <span>Show &ldquo;Verified Buyer&rdquo; badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest-950">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-900 focus:ring-forest-700"
                />
                <span>Active / Display on Homepage</span>
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
              <span>{saving ? 'Saving...' : isCreating ? 'Publish Review' : 'Update Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white p-5 rounded-2xl border shadow-sm space-y-3 relative flex flex-col justify-between ${
              rev.is_active !== false ? 'border-sand-200' : 'border-dashed border-charcoal-300 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rev.is_active !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-charcoal-100 text-charcoal-600'
                    }`}
                  >
                    {rev.is_active !== false ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-charcoal-700 italic leading-relaxed font-sans">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-forest-950">{rev.customer_name}</h4>
                <p className="text-[11px] text-charcoal-400">
                  {rev.location} • {rev.product_id}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(rev)}
                  className="p-1.5 text-forest-900 hover:bg-sand-100 rounded-lg transition-colors"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
