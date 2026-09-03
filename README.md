# 🌿 HERBAL E COM LIFE - Phase 2 Supabase Backend Integration Guide

> **Naturally Better. Everyday.**  
> A complete, modern, high-converting organic & herbal wellness e-commerce platform built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, and Supabase (PostgreSQL, Authentication, Row Level Security, and Storage).

---

## 📖 Table of Contents

1. [What Supabase Is & How HERBAL E COM LIFE Uses It](#1-what-supabase-is--how-herbal-e-com-life-uses-it)
2. [Step-by-Step Supabase Project Setup](#2-step-by-step-supabase-project-setup)
3. [Environment Variables Setup (`.env.local`)](#3-environment-variables-setup-envlocal)
4. [Running the Database Schema (`schema.sql`)](#4-running-the-database-schema-schemasql)
5. [Seeding the Database (`seed.sql`)](#5-seeding-the-database-seedsql)
6. [Creating the Supabase Storage Bucket (`product-images`)](#6-creating-the-supabase-storage-bucket-product-images)
7. [Creating & Promoting Your First Admin User](#7-creating--promoting-your-first-admin-user)
8. [How Customer Authentication & Orders Work](#8-how-customer-authentication--orders-work)
9. [How Admin Management Works](#9-how-admin-management-works)
10. [Local Development & Testing Checklist](#10-local-development--testing-checklist)

---

## 1. What Supabase Is & How HERBAL E COM LIFE Uses It

[Supabase](https://supabase.com) is an open-source Firebase alternative powered by PostgreSQL. In this project, Supabase handles:

1. **Authentication**: Secure customer signup, login, and session management using `auth.users`.
2. **PostgreSQL Database**:
   - `profiles`: Customer and admin profiles with automatic signup trigger.
   - `categories`: Organic wellness product categories.
   - `products`: Complete botanical product catalog (price, stock, benefits, ingredients, usage).
   - `product_images`: Relational multi-image gallery support.
   - `orders`: Order transaction header (status, shipping address, totals).
   - `order_items`: Line items linked to orders and products.
   - `newsletter_subscribers`: Email subscriber captures.
   - `reviews`: Verified buyer product reviews and star ratings.
3. **Server-Side Checkout Validation (RPC)**:
   - `create_order_secure` function computes order prices directly from database records, preventing client-side price manipulation, and atomically reduces inventory stock upon checkout.
4. **Row Level Security (RLS)**:
   - Protects customer data so customers can only access their own profile and orders.
   - Restricts catalog management, order status modification, and subscriber exports exclusively to administrators.
5. **Supabase Storage**:
   - `product-images` bucket for uploading and serving high-resolution product imagery.

---

## 2. Step-by-Step Supabase Project Setup

1. Visit [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**.
3. Fill in the project details:
   - **Name**: `herbal-life`
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Choose the region closest to your target audience (e.g. `South Asia (Mumbai)` for India).
4. Click **Create new project** and wait ~1 minute for provisioning.

---

## 3. Environment Variables Setup (`.env.local`)

1. In your Supabase Dashboard, click the **Settings icon (⚙️) -> API** in the sidebar.
2. Find:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys -> `anon` `public`** (starts with `eyJ...`)
3. In your project directory, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
4. Open `.env.local` and paste your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

> ⚠️ **CRITICAL SECURITY NOTE**: Never commit `.env.local` to Git. Never expose your Supabase `service_role` key in frontend code.

---

## 4. Running the Database Schema (`schema.sql`)

1. In your Supabase dashboard, click the **SQL Editor** tab (icon looks like `>_` on the left).
2. Click **New query**.
3. Open `supabase/schema.sql` from this repository, copy its entire contents, paste into the editor, and click **Run**.
4. ✅ *This creates all 8 tables, indexes, automatic user profile trigger, RLS policies, storage policies, and the `create_order_secure` RPC function.*

---

## 5. Seeding the Database (`seed.sql`)

1. In the **SQL Editor**, click **New query**.
2. Open `supabase/seed.sql` from this repository, copy its entire contents, paste into the editor, and click **Run**.
3. ✅ *This populates your store with 5 realistic wellness categories and 10+ authentic organic herbal products (Moringa, Ashwagandha, Bhringraj Oil, Aloe Cleanser, Raw Honey, etc.) with images and reviews.*

---

## 6. Creating the Supabase Storage Bucket (`product-images`)

1. In the Supabase Dashboard, click **Storage** in the left sidebar.
2. If `product-images` is not already listed, click **New Bucket**.
3. Name the bucket: `product-images`.
4. Check the **Public bucket** toggle (so product images can be viewed publicly by customers).
5. Click **Save**.

---

## 7. Creating & Promoting Your First Admin User

Herbal E Com Life uses strict database-level **Role-Based Access Control (RBAC)**.
By default, all new users signing up via `/signup` or `/login` are assigned the `customer` role.

To grant administrator rights to an account:

1. Create your admin user in Supabase Authentication:
   - Go to your Supabase Dashboard -> **Authentication** -> **Users**.
   - Click **Add user** -> **Create user**.
2. Register an account with your desired admin email (e.g. `admin@herbalecomlife.com`) and password.
3. Open the **SQL Editor** in Supabase and run the following command to upgrade the role:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'admin@herbalecomlife.com';
   ```
2. Now visit `http://localhost:3000/admin/login` and log in. You will be granted full access to the Admin Dashboard!

*(In preview mode, you can also use the **"One-Click Demo Admin Login"** button on `/admin/login` for instant testing).*

---

## 8. How Customer Authentication & Orders Work

1. **Signup / Login**: Customer registers at `/signup` or logs in at `/login`. Supabase Auth handles authentication and the database trigger creates their `profiles` row.
2. **Browsing & Cart**: The customer browses `/shop`, adds items to their basket (saved in `localStorage`), and navigates to `/cart`.
3. **Cash on Delivery Checkout**:
   - At `/checkout`, the customer enters their delivery address and confirms COD.
   - The app calls the database function `create_order_secure` which verifies product prices directly from the `products` table, checks stock availability, creates the order and line items, decrements inventory stock, and clears the cart.
4. **Order Success**: Customer receives order reference (`HL-2026-XXXX`) on `/order-success`.
5. **Customer Orders**: Customer visits `/account/orders` to track all orders linked to their account.

---

## 9. How Admin Management Works

1. **Admin Login (`/admin/login`)**: Checks credentials and validates that `role === 'admin'` from the database. Unauthorized customers receive an explicit access denied error.
2. **Dashboard (`/admin`)**: Shows Total Products, Total Orders, Pending Orders, and Gross Revenue (excluding cancelled orders).
3. **Product Management (`/admin/products`, `/admin/products/new`, `/admin/products/[id]`)**:
   - View, search, and filter catalog.
   - Toggle product visibility (`Active` / `Inactive`).
   - Create new products with slug generator and direct file upload to Supabase Storage (`product-images` bucket).
   - Edit or delete products.
4. **Order Fulfillment (`/admin/orders`)**:
   - View all customer orders, delivery addresses, and purchased items.
   - Live status updater dropdown (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`).

---

## 10. Local Development & Testing Checklist

### Run the App:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Verification Checklist:
- [x] Homepage products and categories load from database
- [x] Shop page filters by category, price range, and search
- [x] Product detail pages show gallery, pricing, stock, and accordions
- [x] Customer signup creates user in `auth.users` and row in `profiles`
- [x] Customer login sets Supabase session
- [x] Cart persists across page reloads
- [x] COD checkout creates order and decrements stock in Supabase
- [x] Order success page displays order details
- [x] Customer can only see their own orders in `/account/orders`
- [x] Admin login denies non-admin accounts
- [x] Admin portal allows managing products, uploading images, and updating order statuses
- [x] Production build passes with 0 errors (`npm run build`)
