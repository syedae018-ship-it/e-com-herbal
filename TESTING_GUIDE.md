# 🧪 MUSTAFA LIFE - Phase 2.5 End-to-End Testing Guide

This guide provides step-by-step instructions to verify every flow of the **MUSTAFA LIFE** e-commerce application.

---

## 🛍️ 1. Customer Journey Test

### Step 1: Browse Catalog & Test Filters
1. Open [http://localhost:3000](http://localhost:3000).
2. Verify the 11 homepage sections render cleanly:
   - Rotating promotional announcement bar.
   - Hero banner (*"Wellness, the Natural Way."*).
   - 4 Trust cards (*100% Natural*, *Chemical Conscious*, etc.).
   - Category cards (*Herbal Wellness*, *Natural Skincare*, etc.).
   - Nature's Best Sellers showcase.
   - Shop by Need & Split Philosophy section.
   - Customer Reviews & Newsletter subscription.
3. Click **"Shop All"** in the navigation bar to visit `/shop`.
4. Test interactive catalog controls:
   - Filter by category (e.g. click *Herbal Wellness*).
   - Adjust the **Price Range** slider (e.g. max ₹500).
   - Type in the **Search bar** (e.g. `"moringa"` or `"aloe"`).
   - Change the **Sort dropdown** to *Price: Low to High*.
   - Verify products update instantly in Indian Rupees (₹).

---

### Step 2: Product Detail & Stock Limit Verification
1. Click on any product (e.g. **Organic Moringa Superfood Powder**).
2. On `/product/organic-moringa-powder`:
   - Verify the thumbnail image gallery switches images on click.
   - Verify the accordion tabs expand and collapse (*Key Benefits*, *Full Ingredients*, *How to Use*, *Shipping & Delivery*).
   - Try to increase the quantity past available stock (e.g. if stock is 10, the `+` button disables at 10).
3. Click **"ADD TO CART"**.
   - Notice the toast notification appears (*"Added Organic Moringa Superfood Powder to your basket"*).
   - Notice the Cart counter badge in the header increments.
4. Click the Cart icon in the header to open the **Slide-over Cart Drawer**:
   - Check the **Free Shipping Progress Bar** (unlocks at ₹499).
   - Try increasing quantity in the drawer — verify it enforces available stock limits.

---

### Step 3: Customer Signup & Authentication
1. Click the **Account** icon in the header or navigate to `/signup`.
2. Register a new test customer account:
   - **Full Name**: `Priya Sharma`
   - **Email**: `priya.sharma@example.com`
   - **Password**: `mustafalife123`
3. Click **Create Account**.
4. Verify you are automatically logged in and redirected to `/account`.
5. Verify the dashboard greets you with your real name and email.

---

### Step 4: Cash on Delivery Checkout & Order Creation
1. Navigate to `/cart` and click **"Proceed to Checkout"** (or go to `/checkout`).
2. Verify your name and email are pre-filled from your profile.
3. Fill in the delivery address:
   - **Phone**: `+91 98765 43210`
   - **Address**: `42 Lotus Boulevard, 4th Floor`
   - **City**: `Bengaluru`
   - **State**: `Karnataka`
   - **PIN Code**: `560001`
4. Select **Cash on Delivery (COD)**.
5. Click **"PLACE CASH ON DELIVERY ORDER"**.
6. Verify:
   - You are redirected to `/order-success?orderNumber=HL-2026-XXXX`.
   - The order reference number, delivery address, and total amount are displayed.
   - Your shopping cart is automatically cleared.

---

### Step 5: View Order in Customer History
1. Click **"VIEW MY ORDERS"** or navigate to `/account/orders`.
2. Verify the newly placed order appears with:
   - Order number (`HL-2026-XXXX`)
   - Order date
   - Status badge (**Pending**)
   - Purchased items list with individual prices and quantities
   - Delivery address.

---

## 🔐 2. Admin Journey Test

### Step 1: Promote Your Account to Administrator
1. In your **Supabase Dashboard** -> **SQL Editor**, run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'priya.sharma@example.com';
   ```
*(Alternatively, in local preview mode, visit `/admin/login` and click **"One-Click Demo Admin Login"**).*

---

### Step 2: Admin Login & Authorization Guard
1. Navigate to `/admin/login`.
2. Log in with your admin credentials.
3. Verify:
   - You are redirected to `/admin` (Admin Dashboard).
   - If a regular customer account attempts to log into `/admin/login`, it displays:
     `"You do not have administrator access."`
   - Unauthenticated access to `/admin`, `/admin/products`, or `/admin/orders` displays the Admin Authentication Required screen.

---

### Step 3: Admin KPI Dashboard Verification
1. On `/admin`:
   - Check the 4 KPI cards: **Total Products**, **Total Orders**, **Pending Orders**, and **Total Revenue**.
   - Verify Total Revenue calculates gross sales from active orders and excludes cancelled orders.
   - Check the **Recent Orders** table showing the latest customer transactions.

---

### Step 4: Product Creation with Image Upload
1. In the Admin Sidebar, click **"Products"** -> **"Add New Product"** (or visit `/admin/products/new`).
2. Fill in the product details:
   - **Name**: `Organic Ashwagandha Gold Extract`
   - **URL Slug**: Automatically generates `organic-ashwagandha-gold-extract`.
   - **Short Tagline**: `Full-spectrum root extract for calming stress relief.`
   - **Sale Price**: `649`
   - **MRP**: `899`
   - **Stock**: `40`
   - **Category**: `Herbal Wellness`
   - **Image Upload**: Upload a JPG/PNG image (under 5MB).
   - **Active & Featured**: Check both toggles.
3. Click **"Publish Product to Catalog"**.
4. Verify:
   - The product is published to Supabase `products` and `product_images` tables.
   - The product appears in the Admin product table and on the public `/shop` catalog.

---

### Step 5: Product Editing & Deletion Safeguards
1. In `/admin/products`, click **"Edit"** on any product.
2. Update the price, stock, or reorder images using the **Up/Down** buttons.
3. Save changes and verify they reflect instantly.
4. Verify that deleting a product does **not** break past customer orders (historical line items preserve purchased name and price).

---

### Step 6: Order Fulfillment & Status Management
1. In the Admin Sidebar, click **"Orders"** (or visit `/admin/orders`).
2. Locate the customer order placed earlier.
3. Open the **Status dropdown** and update from `Pending` ➔ `Shipped` (or `Delivered`).
4. Refresh the page to confirm the status persists in Supabase.
5. In the customer account (`/account/orders`), verify the order status updates to **Shipped** in real time.

---

## 🛡️ 3. Security & Boundary Checklist

| Test Item | Expected Result | Status |
| :--- | :--- | :--- |
| **Price Tampering Prevention** | Order totals and line prices are calculated directly from the database `products` table via `create_order_secure` RPC. | ✅ PASS |
| **Customer Data Isolation** | Customers can only view their own profile and order history; URL tampering on `/order-success` blocks unauthorized views. | ✅ PASS |
| **Admin Route Protection** | `/admin/*` routes strictly require `role = 'admin'`. Non-admins are blocked at both the UI and database RLS layers. | ✅ PASS |
| **Stock Inventory Clamping** | Cart additions cannot exceed available inventory stock; stock decrements atomically upon order placement. | ✅ PASS |
| **Storage Upload Guards** | Image uploads are restricted to image MIME types (JPG, PNG, WebP, AVIF) and capped at 5MB. | ✅ PASS |
| **Production Build** | `npm run build` succeeds with 0 compilation errors across all 32 routes. | ✅ PASS |
