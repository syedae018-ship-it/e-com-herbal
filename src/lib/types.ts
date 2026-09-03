// HERBAL E COM LIFE - DOMAIN TYPE DEFINITIONS (PHASE 2)

export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  image_url: string;
  sort_order?: number;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category_id?: string;
  category?: Category;
  price: number;
  original_price?: number;
  stock: number;
  featured: boolean;
  is_active: boolean;
  benefits?: string;
  ingredients?: string;
  how_to_use?: string;
  images?: string[];
  created_at?: string;
  updated_at?: string;
  rating?: number;
  review_count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id?: string;
  customer_name: string;
  location?: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at?: string;
  is_active?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

// ==============================================================================
// CMS & DYNAMIC WEBSITE CONTENT TYPES
// ==============================================================================

export interface HeroContent {
  is_enabled: boolean;
  badge_text: string;
  heading_line1: string;
  heading_line2_highlight: string;
  description: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  hero_image: string;
  hero_card_tag: string;
  hero_card_title: string;
  hero_card_price: string;
  hero_card_original_price: string;
  hero_card_link: string;
  badge1_text: string;
  badge2_text: string;
  badge3_text: string;
}

export interface TrustBenefitItem {
  id: string;
  icon: string; // 'leaf' | 'flask' | 'heart' | 'sparkles' | 'shield' | 'award'
  title: string;
  description: string;
}

export interface TrustBenefitsContent {
  is_enabled: boolean;
  items: TrustBenefitItem[];
}

export interface CategoriesSectionContent {
  is_enabled: boolean;
  badge_text: string;
  heading: string;
  subtitle: string;
}

export interface BestsellersSectionContent {
  is_enabled: boolean;
  badge_text: string;
  heading: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

export interface NeedItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  slug: string;
  bgClass: string;
}

export interface ShopByNeedContent {
  is_enabled: boolean;
  badge_text: string;
  heading: string;
  subtitle: string;
  items: NeedItem[];
}

export interface FeaturedSplitContent {
  is_enabled: boolean;
  badge_text: string;
  heading_line1: string;
  heading_line2_highlight: string;
  description: string;
  image_url: string;
  image_tag: string;
  image_tag_sub: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  button_text: string;
  button_link: string;
}

export interface WhyChooseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyHerbalLifeContent {
  is_enabled: boolean;
  badge_text: string;
  heading: string;
  subtitle: string;
  items: WhyChooseItem[];
}

export interface CustomerReviewsContent {
  is_enabled: boolean;
  badge_text: string;
  heading: string;
  subtitle: string;
  items: Review[];
}

export interface NewsletterSectionContent {
  is_enabled: boolean;
  heading: string;
  subtitle: string;
  disclaimer: string;
  button_text: string;
}

export type ThemeId =
  | 'herbal-beige-brown'
  | 'fresh-green-contrast'
  | 'eucalyptus-sea-salt'
  | 'vetiver-forest-moss';

export interface ThemeColorSwatch {
  name: string;
  value: string;
  role: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  style: string;
  vibe: string;
  description: string;
  palette: ThemeColorSwatch[];
  colors: {
    primaryBg: string;
    secondaryBg: string;
    primaryMain: string;
    darkMain: string;
    accent: string;
    surface: string;
    textPrimary: string;
    textMuted: string;
    border: string;
    navbar: string;
    footer: string;
  };
}

export interface SiteSettingsContent {
  site_name: string;
  site_tagline: string;
  active_theme: ThemeId;
  logo_url: string;
  hero_tagline: string;
  promotional_tagline: string;
  health_wellness_message: string;
  product_tagline: string;
  cta_message: string;
  welcome_message: string;
  contact_email: string;
  contact_phone: string;
  free_shipping_threshold: number;
  announcement_bar_enabled: boolean;
  announcements: string[];
}

export interface FooterTrustBadge {
  icon: string;
  title: string;
  description: string;
}

export interface FooterContent {
  is_enabled?: boolean;
  about_text: string;
  copyright_text: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  care_email: string;
  trust_badges: FooterTrustBadge[];
}

export interface WebsiteContent {
  hero: HeroContent;
  trust_benefits: TrustBenefitsContent;
  categories_section: CategoriesSectionContent;
  bestsellers_section: BestsellersSectionContent;
  shop_by_need: ShopByNeedContent;
  featured_split: FeaturedSplitContent;
  why_herbal_life: WhyHerbalLifeContent;
  customer_reviews: CustomerReviewsContent;
  newsletter_section: NewsletterSectionContent;
  settings: SiteSettingsContent;
  footer: FooterContent;
}
