# The Grand Kitchen — Restaurant Management & Billing System

A high-performance, full-stack Restaurant Management and Billing System built with **Next.js 16 (App Router)**, **React 19**, **Prisma ORM**, **SQLite**, **Tailwind CSS 4**, and **TypeScript**.

Developed for the **Technical Assessment: Restaurant Billing & Management System (One-Day Development Assignment)**.

---

## 🚀 Live Workflow & Features Implemented

The application models the end-to-end lifecycle of a high-volume restaurant:

### 1. 📊 Executive Operations & Live Dashboard (`/`)
- **Real-Time KPIs**: Today's Revenue (in INR ₹), Total Orders Count, Live Active Tables in Kitchen/Dining, and Average Order Value (AOV).
- **Live Dining Pipeline**: Real-time cards showing active table numbers, order type (Dine-in vs. Takeaway), item counts, time elapsed, and quick buttons to settle payments or view bills.
- **Top Dishes Sold**: Leaderboard of top-selling dishes with quantities sold and revenue share.
- **Recent Order History**: Table with order #, table, item count, total, live status pills, and direct access.

### 2. ⚡ POS Terminal & Order Creation (`/orders/new`)
- **Category Filter Tabs**: Instant filtering across *Starters*, *Main Course*, *Breads*, *Rice & Biryani*, *Desserts*, and *Beverages*.
- **Live Search**: Instant client-side search across dish titles and ingredients.
- **Interactive Menu Cards**: Real-time availability indicators (In Stock vs. Sold Out), Veg/Non-Veg friendly presentation, unit prices, and quantity steppers (`-` / `+`).
- **Dynamic Order Cart**:
  - Dine-in vs. Takeaway toggle.
  - Table selection chips (`T-1` to `T-12`, `VIP-1`) plus custom table input (`Garden-2`, `Patio-4`).
  - Item quantity controllers and line-item removals.
  - Special kitchen notes (e.g., "Less spicy, extra lemons").
  - Live monetary computation: Subtotal, Custom Discount %, GST (5%), and Service Charge %.
  - Safe transactional placement with Zod validation.

### 3. 📋 Orders & Table Management (`/orders`)
- **Status Filtering**: Filter by *All Orders*, *Active*, *Completed*, or *Cancelled*.
- **Search & Type Filter**: Filter by table number, order ticket number, or dish name.
- **Order Cards / Table**: Detailed summary showing order type badge, item counts, timestamps, and actionable shortcuts.
- **Quick Status Transitions**: One-click actions to settle bills, cancel orders, or inspect details.

### 4. 💳 Order Details & Multi-Payment Settlement (`/orders/[id]`)
- **Order Overview**: Full breakdown of dining ticket, table number, order type, and timestamps.
- **Add Dishes to Active Ticket**: Waitstaff can append additional food or drinks to an active table without restarting the order—the bill automatically recalculates subtotal, discounts, and taxes!
- **Multi-Method Payment Settlement**:
  - Supports **Cash**, **UPI / QR**, **Credit/Debit Card**, and **Other**.
  - Partial & Split Payments: Supports paying part via cash and part via UPI, updating the outstanding balance in real time until the bill is fully paid.
  - Transaction reference recording (e.g., UPI UTR numbers, cashier initials).

### 5. 🖨️ Customer Tax Invoice & 80mm Thermal Receipt (`/billing/[id]`)
- **Authentic Restaurant Tax Invoice**:
  - Restaurant branding header (Name, Address, Phone, Email, GSTIN).
  - Tax invoice metadata (Bill #, Date, Time, Order Type, Table #).
  - Itemized table with Item Name, Qty, Unit Rate, and Line Total.
  - Tax breakdown with split **CGST (2.5%)** and **SGST (2.5%)** compliant with Indian restaurant GST norms.
  - Payment records listing method and references.
  - Receipt footer greeting from settings.
- **Print-Ready**: Dedicated `@media print` CSS formatted for 80mm thermal receipt printers and standard paper, automatically hiding app navigation.

### 6. 🍽️ Menu Management Catalog (`/menu`)
- **Complete CRUD**:
  - Add new dishes with Name, Category, Price (₹), and Description.
  - Edit dish prices, categories, and details in a modal dialog.
  - Instant **Availability Toggle** (marks items as "Sold Out", instantly disabling them in the POS terminal to prevent kitchen over-ordering).
  - Delete dish with referential integrity guard (prevents deleting items already linked to existing order records).

### 7. ⚙️ System & Billing Settings (`/settings`)
- Configure restaurant profile (Name, Address, Phone, Email).
- Set GSTIN tax registration number.
- Configure default Tax (GST %) and default Service Charge (%).
- Customize customer receipt footer note.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.4.0 (App Router, Server Actions) |
| **Frontend Library** | React 19, Framer Motion (animated toasts) |
| **Styling** | Vanilla Tailwind CSS 4 with custom glassmorphism design tokens |
| **Database** | SQLite (via Prisma ORM 5.22.0) |
| **Validation** | Zod 4 for input schema enforcement |
| **Currency Safety** | Integer-paise precision arithmetic (`100 paise = ₹1.00`) |

### Architecture Highlights
1. **Zero Floating-Point Money Errors**:
   - All monetary values (`subtotalInPaise`, `totalInPaise`, `taxInPaise`, `priceInPaise`) are stored in integer paise in the database.
   - Calculations use dedicated deterministic helpers in `src/lib/money.ts` to eliminate JavaScript IEEE 754 floating-point rounding bugs.
2. **Server Actions with Server-Side Validation**:
   - All state mutations (`createOrder`, `recordPayment`, `addItemToOrder`, `updateMenuItem`, `updateSettings`) run via Next.js Server Actions with Zod parsing.
   - Automatic cache revalidation (`revalidatePath`) ensures immediate synchronization across tabs and terminals.
3. **Optimized POS UX**:
   - High-contrast, dark-mode restaurant POS interface designed for dimly lit restaurants and fast touchscreen operation.

---

## 📦 How to Run Locally

### Prerequisites
- Node.js (v18.18.0 or later)
- npm or pnpm

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set up Database & Seed Data
```bash
# Push schema to SQLite
npx prisma db push

# Seed restaurant settings, 20+ authentic menu items, and initial orders
node prisma/seed.js
```

### Step 3: Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Production Build (Optional)
```bash
npm run build
npm run start
```

---

## 🗄️ Database Schema Overview

- **`MenuItem`**: `id`, `name`, `description`, `category`, `priceInPaise`, `available`, `sortOrder`, timestamps.
- **`Order`**: `id`, `orderNumber` (unique auto-incrementing ticket), `orderType` (dine-in / takeaway), `tableNumber`, `status` (active / completed / cancelled), `note`, `subtotalInPaise`, `discountPercent`, `taxPercent`, `servicePercent`, `totalInPaise`, `createdAt`, `completedAt`.
- **`OrderItem`**: `id`, `orderId`, `menuItemId`, `itemName`, `unitPriceInPaise`, `quantity`, `lineTotalInPaise`.
- **`Payment`**: `id`, `orderId`, `amountInPaise`, `method` (cash / card / upi / other), `status`, `reference`, `createdAt`.
- **`RestaurantSettings`**: `id`, `name`, `address`, `phone`, `email`, `gstNumber`, `currency`, `currencySymbol`, `defaultTax`, `defaultService`, `receiptFooter`.

---

## 🔮 Future Roadmap / Next Improvements

If additional development time were available, the following features would be implemented:
1. **Kitchen Display System (KDS)**: Dedicated full-screen kitchen monitor with order item status (`Pending` → `Preparing` → `Ready to Serve`) and audio chimes for new tickets.
2. **Table Layout / Floor Plan View**: Interactive graphical restaurant floor plan with draggable tables and visual color-coding (Green = Free, Amber = Occupied, Red = Bill Requested).
3. **Staff Shift & Cash Drawer Reconciliation**: End-of-day register closure reports comparing expected cash drawer balances with recorded cash transactions.
4. **Offline PWA Support**: Service worker caching and IndexedDB sync for network-resilient ordering during internet outages.
