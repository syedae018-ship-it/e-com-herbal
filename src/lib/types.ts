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
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}
