'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadWebsiteImage } from '@/lib/db/content';
import { Upload, RotateCcw, Trash2, Link as LinkIcon, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AdminImageUploadProps {
  label: string;
  description?: string;
  currentImageUrl: string;
  defaultImageUrl?: string;
  onChange: (newUrl: string) => void;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  className?: string;
}

export const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  label,
  description,
  currentImageUrl,
  defaultImageUrl,
  onChange,
  aspectRatio = 'video',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[4/5]';
      case 'wide':
        return 'aspect-[21/9]';
      case 'video':
      default:
        return 'aspect-[16/9]';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setUploading(true);

    try {
      const res = await uploadWebsiteImage(file);
      if (res.success && res.url) {
        onChange(res.url);
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to upload image.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error uploading image.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    setMessage({ type: 'success', text: 'Image URL updated!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRestoreDefault = () => {
    if (defaultImageUrl) {
      onChange(defaultImageUrl);
      setMessage({ type: 'success', text: 'Restored default image!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemove = () => {
    onChange('');
    setMessage({ type: 'success', text: 'Image removed.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const isDefault = defaultImageUrl && currentImageUrl === defaultImageUrl;

  return (
    <div className={`bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest-950">
            {label}
          </label>
          {description && <p className="text-xs text-charcoal-500 mt-0.5">{description}</p>}
        </div>

        {defaultImageUrl && !isDefault && (
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 bg-sand-100 hover:bg-sand-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-forest-700" />
            <span>Restore Default</span>
          </button>
        )}
      </div>

      {/* Image Preview Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-5">
          <div
            className={`relative w-full ${getAspectRatioClass()} rounded-xl overflow-hidden bg-sand-100 border border-sand-200 shadow-inner flex items-center justify-center`}
          >
            {currentImageUrl ? (
              <Image
                src={currentImageUrl}
                alt={label}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
            ) : (
              <div className="text-center p-4 text-charcoal-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 text-charcoal-300" />
                <span className="text-xs font-medium">No Image Selected</span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-sage-300" />
              <span>Upload New Image</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1.5 bg-sand-100 hover:bg-sand-200 text-charcoal-800 font-semibold px-3.5 py-2.5 rounded-xl text-xs border border-sand-300 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-charcoal-600" />
              <span>{showUrlInput ? 'Hide URL Input' : 'Enter URL'}</span>
            </button>

            {currentImageUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 text-rose-600 hover:bg-rose-50 font-semibold px-3 py-2.5 rounded-xl text-xs border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {showUrlInput && (
            <div className="flex items-center gap-2 pt-1 animate-fade-in">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="bg-forest-900 text-cream-50 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-forest-800 transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          )}

          {currentImageUrl && (
            <p className="text-[11px] text-charcoal-400 truncate max-w-md">
              <span className="font-semibold text-charcoal-600">Source: </span>
              {currentImageUrl}
            </p>
          )}

          {message && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium animate-fade-in ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
