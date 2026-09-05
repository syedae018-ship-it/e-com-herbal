import { supabase, isSupabaseConfigured } from '../supabase/client';
import {
  WebsiteContent,
  HeroContent,
  TrustBenefitsContent,
  CategoriesSectionContent,
  BestsellersSectionContent,
  ShopByNeedContent,
  FeaturedSplitContent,
  WhyHerbalLifeContent,
  CustomerReviewsContent,
  NewsletterSectionContent,
  SiteSettingsContent,
  FooterContent,
} from '../types';

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    is_enabled: true,
    badge_text: 'Pure Wellness, Powered by Nature',
    heading_line1: 'Wellness, the',
    heading_line2_highlight: 'Natural Way.',
    description:
      'Discover thoughtfully crafted organic and herbal products made for healthier everyday living. Clean botanical ingredients, ancient Ayurvedic wisdom, and zero harsh chemicals.',
    primary_btn_text: 'SHOP NOW',
    primary_btn_link: '/shop',
    secondary_btn_text: 'EXPLORE COLLECTIONS',
    secondary_btn_link: '/shop#categories',
    hero_image:
      '/images/products/neem-tulsi-soap.jpg',
    hero_card_tag: 'Handcrafted Botanical',
    hero_card_title: 'Neem & Tulsi Herbal Soap',
    hero_card_price: '₹149',
    hero_card_original_price: '₹199',
    hero_card_link: '/product/neem-tulsi-herbal-soap',
    badge1_text: '100% Certified Organic',
    badge2_text: 'Ayush & GMP Certified',
    badge3_text: 'Free Delivery Above ₹499',
  },
  trust_benefits: {
    is_enabled: true,
    items: [
      {
        id: 'tb-1',
        icon: 'leaf',
        title: '100% Natural Ingredients',
        description: 'Sourced directly from organic certified farms across pristine Indian terroir.',
      },
      {
        id: 'tb-2',
        icon: 'flask',
        title: 'Chemical Conscious',
        description: 'Zero parabens, sulfates, silicones, synthetic fragrances, or artificial colors.',
      },
      {
        id: 'tb-3',
        icon: 'heart',
        title: 'Made with Care',
        description: 'Small batch traditional decoctions that preserve delicate bioactive phytonutrients.',
      },
      {
        id: 'tb-4',
        icon: 'sparkles',
        title: 'Cruelty Free',
        description: 'Never tested on animals. 100% vegan, ethically gathered, and environmentally safe.',
      },
    ],
  },
  categories_section: {
    is_enabled: true,
    badge_text: 'Curated Collections',
    heading: 'Shop by Category',
    subtitle: 'Explore pure, plant-powered solutions tailored for every aspect of your daily wellness ritual.',
  },
  bestsellers_section: {
    is_enabled: true,
    badge_text: 'Customer Favorites',
    heading: "Nature's Best Sellers",
    subtitle: 'Our most-loved natural daily remedies, handcrafted with certified organic herbs and time-tested Ayurvedic wisdom.',
    button_text: 'View All Bestsellers',
    button_link: '/shop',
  },
  shop_by_need: {
    is_enabled: true,
    badge_text: 'Targeted Solutions',
    heading: 'Shop by Your Need',
    subtitle: 'Target specific wellness goals with scientifically formulated Ayurvedic remedies.',
    items: [
      {
        id: 'need-1',
        icon: 'shield',
        title: 'Better Immunity',
        desc: 'Giloy, Tulsi, and Vitamin C extracts to defend against seasonal pollutants.',
        slug: 'herbal-wellness',
        bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      },
      {
        id: 'need-2',
        icon: 'sparkles',
        title: 'Healthy Skin',
        desc: 'Aloe Vera, Rose, and Turmeric tonics to replenish deep natural radiance.',
        slug: 'natural-skincare',
        bgClass: 'bg-rose-50 text-rose-800 border-rose-100',
      },
      {
        id: 'need-3',
        icon: 'flame',
        title: 'Stronger Hair',
        desc: 'Bhringraj, Amla, and Rosemary decoctions for denser roots and shine.',
        slug: 'hair-care',
        bgClass: 'bg-amber-50 text-amber-800 border-amber-100',
      },
      {
        id: 'need-4',
        icon: 'zap',
        title: 'Daily Energy',
        desc: 'Organic Moringa and Ashwagandha to combat fatigue and revitalize stamina.',
        slug: 'healthy-nutrition',
        bgClass: 'bg-teal-50 text-teal-800 border-teal-100',
      },
      {
        id: 'need-5',
        icon: 'apple',
        title: 'Digestive Wellness',
        desc: 'Raw forest honey and gut-nourishing superfoods for comfortable digestion.',
        slug: 'healthy-nutrition',
        bgClass: 'bg-lime-50 text-lime-800 border-lime-100',
      },
      {
        id: 'need-6',
        icon: 'activity',
        title: 'Stress & Sleep',
        desc: 'KSM-66 full-spectrum adaptogens to soothe mind and support restful nights.',
        slug: 'herbal-wellness',
        bgClass: 'bg-indigo-50 text-indigo-800 border-indigo-100',
      },
    ],
  },
  featured_split: {
    is_enabled: true,
    badge_text: 'Pure & Honest Formulations',
    heading_line1: 'Simple Ingredients.',
    heading_line2_highlight: 'Powerful Nature.',
    description:
      'We believe everyday wellness starts with honest ingredients and mindful choices. No fillers, no hidden nasties, and no artificial shortcuts. Just whole, potent botanicals formulated to nurture your body inside and out.',
    image_url:
      '/images/categories/herbal-skincare.jpg',
    image_tag: 'Zero Compromise Philosophy',
    image_tag_sub: 'Rooted in ancient Ayurveda. Perfected by modern lab standards.',
    bullet1: 'Single-origin herbs harvested at peak bioactive potency',
    bullet2: 'Zero artificial colors, synthetic binders, or parabens',
    bullet3: 'Transparent full-ingredient disclosure on every bottle',
    button_text: 'EXPLORE PRODUCTS',
    button_link: '/shop',
  },
  why_herbal_life: {
    is_enabled: true,
    badge_text: 'Our Standard of Purity',
    heading: 'Why Choose Nutri Life',
    subtitle: 'We hold our products to the highest standards of clean holistic wellness.',
    items: [
      {
        id: 'why-1',
        icon: 'sprout',
        title: 'Plant Based',
        description: '100% vegetarian and vegan-friendly formulas derived exclusively from whole botanicals, flowers, roots, and seeds.',
      },
      {
        id: 'why-2',
        icon: 'compass',
        title: 'Thoughtfully Sourced',
        description: 'We partner directly with certified organic growers who practice regenerative and chemical-free agriculture.',
      },
      {
        id: 'why-3',
        icon: 'ban',
        title: 'No Unnecessary Additives',
        description: 'Strictly zero petroleum derivatives, phthalates, synthetic preservatives, bleaching agents, or heavy metal residues.',
      },
      {
        id: 'why-4',
        icon: 'heart-handshake',
        title: 'Made for Everyday Wellness',
        description: 'Gentle, bio-compatible formulations designed to be used safely, consistently, and effectively every single day.',
      },
    ],
  },
  customer_reviews: {
    is_enabled: true,
    badge_text: 'Real Stories, Real Wellness',
    heading: 'Loved by Thousands Across India',
    subtitle: 'Read how Nutri Life has become an indispensable part of daily wellness routines.',
    items: [
      {
        id: 'rev-1',
        customer_name: 'Priya Sharma',
        location: 'Bengaluru',
        rating: 5,
        product_id: 'Organic Moringa Superfood Powder',
        comment:
          'The quality is unmatched! I mix a teaspoon into my morning smoothie every day and notice a clear, sustained boost in my energy without the midday crash.',
        verified_purchase: true,
        is_active: true,
      },
      {
        id: 'rev-2',
        customer_name: 'Rohan Mehta',
        location: 'Mumbai',
        rating: 5,
        product_id: 'Herbal Immunity Tablets',
        comment:
          'Essential for changing weather. Since taking these Giloy & Amla tablets, my seasonal allergies are virtually gone. Truly authentic formulation with real herbs.',
        verified_purchase: true,
        is_active: true,
      },
      {
        id: 'rev-3',
        customer_name: 'Ananya Iyer',
        location: 'Chennai',
        rating: 5,
        product_id: 'Pure Aloe Vera Gentle Cleanser',
        comment:
          "So soothing on my sensitive skin! Doesn't leave my face dry or tight like other cleansers. Truly authentic aloe texture with zero artificial fragrance.",
        verified_purchase: true,
        is_active: true,
      },
    ],
  },
  newsletter_section: {
    is_enabled: true,
    heading: 'Stay Naturally Connected',
    subtitle: 'Get holistic wellness tips, seasonal health guides, and exclusive offers delivered directly to your inbox.',
    disclaimer: 'No spam, ever. Unsubscribe at any time with a single click.',
    button_text: 'Subscribe',
  },
  settings: {
    site_name: 'NUTRI LIFE',
    site_tagline: 'Naturally Better. Everyday.',
    active_theme: 'herbal-beige-brown',
    logo_url: '',
    hero_tagline: 'Pure Wellness, Powered by Nature',
    promotional_tagline: 'Ayurvedic Heritage with Modern Purity',
    health_wellness_message: 'Holistic living crafted with 100% natural and certified organic ingredients.',
    product_tagline: 'Fresh Small Batches Handcrafted for Maximum Potency',
    cta_message: 'Discover pure herbal remedies for everyday life.',
    welcome_message: 'Welcome to Nutri Life — Your Pure Botanical Haven',
    contact_email: 'care@nutrilife.com',
    contact_phone: '+91 98765 43210',
    free_shipping_threshold: 499,
    announcement_bar_enabled: true,
    announcements: [
      'Free Shipping on all orders above ₹499 across India',
      'Use code WELCOME10 for 10% Off on your first order',
      '100% Certified Organic & Chemical-Conscious Ingredients',
      'Fresh Small Batches Handcrafted for Maximum Potency',
    ],
  },
  footer: {
    about_text:
      'Naturally Better. Everyday. We formulate clean, honest, and high-potency herbal remedies and nutrition designed to elevate daily health, skin vitality, and hair wellness.',
    copyright_text: `© ${new Date().getFullYear()} NUTRI LIFE India. All rights reserved. Naturally Better. Everyday.`,
    instagram_url: 'https://instagram.com',
    facebook_url: 'https://facebook.com',
    twitter_url: 'https://twitter.com',
    youtube_url: 'https://youtube.com',
    care_email: 'care@nutrilife.com',
    trust_badges: [
      { icon: 'leaf', title: '100% Organic', description: 'Pure bioactive botanical extracts' },
      { icon: 'shield', title: 'Lab Tested', description: 'Zero toxins, heavy metals or fillers' },
      { icon: 'heart', title: 'Cruelty-Free', description: '100% Vegan & ethically sourced' },
      { icon: 'sparkles', title: 'Free Shipping', description: 'On all prepaid & COD above ₹499' },
    ],
  },
};

const STORAGE_KEY = 'nutri_life_cms_content_v1';

let memoryContent: WebsiteContent = { ...DEFAULT_WEBSITE_CONTENT };

export async function getWebsiteContent(): Promise<WebsiteContent> {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        memoryContent = {
          ...DEFAULT_WEBSITE_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_WEBSITE_CONTENT.hero, ...(parsed.hero || {}) },
          trust_benefits: { ...DEFAULT_WEBSITE_CONTENT.trust_benefits, ...(parsed.trust_benefits || {}) },
          categories_section: { ...DEFAULT_WEBSITE_CONTENT.categories_section, ...(parsed.categories_section || {}) },
          bestsellers_section: { ...DEFAULT_WEBSITE_CONTENT.bestsellers_section, ...(parsed.bestsellers_section || {}) },
          shop_by_need: { ...DEFAULT_WEBSITE_CONTENT.shop_by_need, ...(parsed.shop_by_need || {}) },
          featured_split: { ...DEFAULT_WEBSITE_CONTENT.featured_split, ...(parsed.featured_split || {}) },
          why_herbal_life: { ...DEFAULT_WEBSITE_CONTENT.why_herbal_life, ...(parsed.why_herbal_life || {}) },
          customer_reviews: { ...DEFAULT_WEBSITE_CONTENT.customer_reviews, ...(parsed.customer_reviews || {}) },
          newsletter_section: { ...DEFAULT_WEBSITE_CONTENT.newsletter_section, ...(parsed.newsletter_section || {}) },
          settings: { ...DEFAULT_WEBSITE_CONTENT.settings, ...(parsed.settings || {}) },
          footer: { ...DEFAULT_WEBSITE_CONTENT.footer, ...(parsed.footer || {}) },
        };
        return memoryContent;
      }
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*');

      if (!error && data && data.length > 0) {
        const dbContent = { ...DEFAULT_WEBSITE_CONTENT };
        for (const row of data) {
          if (row.key in dbContent) {
            (dbContent as any)[row.key] = row.value;
          }
        }
        memoryContent = dbContent;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbContent));
        }
        return dbContent;
      }
    } catch (err) {
      console.warn('Could not fetch website_content from Supabase, using local content:', err);
    }
  }

  return memoryContent;
}

export async function updateWebsiteSection<K extends keyof WebsiteContent>(
  sectionKey: K,
  sectionData: WebsiteContent[K]
): Promise<{ success: boolean; error?: string }> {
  memoryContent = {
    ...memoryContent,
    [sectionKey]: sectionData,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryContent));
      window.dispatchEvent(new CustomEvent('nutri_life_content_updated', { detail: { key: sectionKey, data: sectionData } }));
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({
          key: sectionKey,
          value: sectionData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

      if (error) {
        console.warn('Supabase website_content upsert error:', error.message);
      }
    } catch (err: any) {
      console.warn('Failed to upsert to Supabase:', err.message);
    }
  }

  return { success: true };
}

export async function resetWebsiteSection<K extends keyof WebsiteContent>(
  sectionKey?: K
): Promise<{ success: boolean }> {
  if (sectionKey) {
    return await updateWebsiteSection(sectionKey, DEFAULT_WEBSITE_CONTENT[sectionKey]);
  } else {
    memoryContent = { ...DEFAULT_WEBSITE_CONTENT };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('nutri_life_content_updated', { detail: { key: 'all' } }));
    }
    return { success: true };
  }
}

export async function uploadWebsiteImage(
  file: File,
  folder = 'website-assets'
): Promise<{ success: boolean; url?: string; error?: string }> {
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg', 'image/svg+xml'];

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { success: false, error: 'Please select a valid image file (JPG, PNG, WebP, AVIF, or SVG).' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `Image size is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`,
    };
  }

  if (!isSupabaseConfigured() || !supabase) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: true, url: URL.createObjectURL(file) });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Image upload failed.' };
  }
}
