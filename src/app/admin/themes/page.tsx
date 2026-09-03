'use client';

import React, { useState } from 'react';
import { useWebsiteContent } from '@/context/ContentContext';
import { CURATED_THEMES, getThemeById } from '@/lib/themes';
import { ThemeId, ThemeDefinition } from '@/lib/types';
import {
  Palette,
  CheckCircle2,
  Sparkles,
  Eye,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkle,
  Layers,
  Leaf,
  Droplets,
  Trees,
} from 'lucide-react';

const THEME_ICONS: Record<ThemeId, React.ElementType> = {
  'herbal-beige-brown': Leaf,
  'fresh-green-contrast': Sparkles,
  'eucalyptus-sea-salt': Droplets,
  'vetiver-forest-moss': Trees,
};

export default function AdminThemesPage() {
  const { content, setTheme, loading } = useWebsiteContent();
  const currentActiveThemeId = (content.settings?.active_theme || 'herbal-beige-brown') as ThemeId;

  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(currentActiveThemeId);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId | null>(null);

  // The active theme definition
  const activeThemeDef = getThemeById(currentActiveThemeId);
  const displayedThemeId = previewThemeId || currentActiveThemeId;
  const displayedThemeDef = getThemeById(displayedThemeId);

  const handleApplyTheme = async (themeId: ThemeId) => {
    setSaving(true);
    setSuccessMessage('');
    setSelectedThemeId(themeId);
    setPreviewThemeId(null);

    try {
      const res = await setTheme(themeId);
      if (res.success) {
        setSuccessMessage(`"${getThemeById(themeId).name}" is now the active website theme!`);
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error applying theme:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTemporaryPreview = (themeId: ThemeId) => {
    setPreviewThemeId(themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  const handleResetPreview = () => {
    setPreviewThemeId(null);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentActiveThemeId);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-24 font-admin-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
              Appearance & Design System
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Dynamic CMS
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">
            Website Theme Management
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 max-w-2xl">
            Select and apply one of 4 curated herbal color palettes. The active theme dynamically coordinates backgrounds, navigation, typography, cards, buttons, and contrast sections across the entire store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-950 border border-sand-300 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </a>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
            Persisted to Settings
          </span>
        </div>
      )}

      {/* Current Active Status Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-cream-50 rounded-2xl p-6 border border-forest-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-sage-300">
              Current Live Theme
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>{activeThemeDef.name}</span>
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-forest-800 text-sage-300 border border-forest-700">
              {activeThemeDef.style}
            </span>
          </h2>
          <p className="text-xs text-sage-200/90 max-w-xl leading-relaxed">
            {activeThemeDef.vibe}
          </p>
        </div>

        {/* Live Palette Dots */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-sage-400">
            Active Theme Palette
          </span>
          <div className="flex items-center gap-1.5 bg-forest-900/90 p-2 rounded-xl border border-forest-800">
            {activeThemeDef.palette.slice(0, 6).map((swatch, idx) => (
              <div
                key={idx}
                title={`${swatch.name}: ${swatch.value}`}
                className="w-6 h-6 rounded-lg border border-white/20 shadow-inner"
                style={{ backgroundColor: swatch.value }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Temporary Preview Alert if previewing without saving */}
      {previewThemeId && previewThemeId !== currentActiveThemeId && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-amber-600" />
            <span>
              Previewing <strong>{getThemeById(previewThemeId).name}</strong>. Click &ldquo;Apply Theme&rdquo; below to save it permanently for all visitors.
            </span>
          </div>
          <button
            onClick={handleResetPreview}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-amber-950 underline ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Preview</span>
          </button>
        </div>
      )}

      {/* 4 Curated Themes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-800" />
            <h3 className="font-serif text-lg font-bold text-forest-950">
              Curated Herbal Themes
            </h3>
          </div>
          <span className="text-xs text-charcoal-500">4 Curated Palettes Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURATED_THEMES.map((theme, index) => {
            const isActive = currentActiveThemeId === theme.id;
            const isPreviewing = previewThemeId === theme.id;
            const IconComponent = THEME_ICONS[theme.id] || Leaf;

            return (
              <div
                key={theme.id}
                className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between space-y-6 relative ${
                  isActive
                    ? 'border-forest-900 ring-2 ring-forest-900/20 shadow-elevated bg-cream-50/30'
                    : isPreviewing
                    ? 'border-amber-400 ring-2 ring-amber-300 shadow-card'
                    : 'border-sand-200 hover:border-sand-400 hover:shadow-card'
                }`}
              >
                {/* Active Badge */}
                {isActive && (
                  <div className="absolute top-5 right-5 inline-flex items-center gap-1 bg-forest-900 text-cream-50 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>ACTIVE THEME</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title & Style */}
                  <div className="flex items-start gap-3.5 pr-28">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border"
                      style={{
                        backgroundColor: theme.colors.primaryBg,
                        borderColor: theme.colors.border,
                        color: theme.colors.primaryMain,
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">
                          Theme {index + 1}
                        </span>
                        <span className="text-[10px] font-medium text-charcoal-500">
                          • {theme.style}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-forest-950 mt-0.5">
                        {theme.name}
                      </h4>
                    </div>
                  </div>

                  {/* Vibe / Description */}
                  <p className="text-xs text-charcoal-600 leading-relaxed font-sans">
                    {theme.description}
                  </p>

                  {/* Color Palette Swatches */}
                  <div className="space-y-2 pt-2 border-t border-sand-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400">
                      Color Palette ({theme.palette.length} Tokens)
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {theme.palette.map((swatch, sIdx) => (
                        <div
                          key={sIdx}
                          className="group relative flex flex-col items-center cursor-pointer"
                        >
                          <div
                            className="w-full h-8 rounded-xl border border-black/10 shadow-sm transition-transform group-hover:scale-105"
                            style={{ backgroundColor: swatch.value }}
                          />
                          <span className="text-[9px] font-mono text-charcoal-600 mt-1 truncate max-w-full">
                            {swatch.value}
                          </span>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-1.5 hidden group-hover:block z-30 w-36 p-1.5 rounded-lg bg-forest-950 text-cream-50 text-[10px] text-center shadow-lg pointer-events-none">
                            <p className="font-bold">{swatch.name}</p>
                            <p className="text-sage-300 text-[9px]">{swatch.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live UI Mockup Preview */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400">
                      UI Component Live Preview
                    </span>
                    <div
                      className="p-4 rounded-2xl border shadow-inner space-y-3 transition-colors duration-200"
                      style={{
                        backgroundColor: theme.colors.primaryBg,
                        borderColor: theme.colors.border,
                      }}
                    >
                      {/* Mini Mockup Navbar */}
                      <div
                        className="flex items-center justify-between px-3 py-2 rounded-xl shadow-xs border"
                        style={{
                          backgroundColor: theme.colors.surface,
                          borderColor: theme.colors.border,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Leaf
                            className="w-3.5 h-3.5"
                            style={{ color: theme.colors.primaryMain }}
                          />
                          <span
                            className="font-serif font-bold text-xs"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            MUSTAFA LIFE
                          </span>
                        </div>
                        <div
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white"
                          style={{ backgroundColor: theme.colors.primaryMain }}
                        >
                          Cart (2)
                        </div>
                      </div>

                      {/* Mini Mockup Hero Banner */}
                      <div
                        className="p-3 rounded-xl border flex items-center justify-between"
                        style={{
                          backgroundColor: theme.colors.secondaryBg,
                          borderColor: theme.colors.border,
                        }}
                      >
                        <div className="space-y-1">
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider block"
                            style={{ color: theme.colors.accent }}
                          >
                            100% Botanical
                          </span>
                          <p
                            className="font-serif font-bold text-xs"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            Naturally Better. Everyday.
                          </p>
                        </div>
                        <div
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: theme.colors.primaryMain }}
                        >
                          Shop Now
                        </div>
                      </div>

                      {/* Mini Mockup Card + Price */}
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="p-2.5 rounded-xl border shadow-xs space-y-1"
                          style={{
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                          }}
                        >
                          <span
                            className="text-[9px] font-medium block truncate"
                            style={{ color: theme.colors.textMuted }}
                          >
                            Organic Moringa
                          </span>
                          <span
                            className="text-xs font-bold font-serif block"
                            style={{ color: theme.colors.primaryMain }}
                          >
                            ₹449
                          </span>
                        </div>

                        {/* Dark Contrast Section Mockup */}
                        <div
                          className="p-2.5 rounded-xl border shadow-xs space-y-1 text-white"
                          style={{
                            backgroundColor: theme.colors.footer,
                            borderColor: theme.colors.darkMain,
                          }}
                        >
                          <span className="text-[9px] text-sage-300 block">Dark Section</span>
                          <span className="text-[10px] font-bold block">Rich Heritage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 border-t border-sand-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleTemporaryPreview(theme.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest-900 transition-colors py-2 px-3 rounded-xl hover:bg-sand-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    type="button"
                    disabled={saving || isActive}
                    onClick={() => handleApplyTheme(theme.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-emerald-600 text-white cursor-default opacity-90'
                        : 'bg-forest-900 text-cream-50 hover:bg-forest-800 hover:shadow-md'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Active Theme</span>
                      </>
                    ) : saving && selectedThemeId === theme.id ? (
                      <span>Applying...</span>
                    ) : (
                      <>
                        <span>Apply This Theme</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
