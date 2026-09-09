# 🌐 MarketSphere — Enterprise Multi-Vendor E-Commerce Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Vitest-30%2F30%20Passing-success?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**MarketSphere** is an enterprise-grade, full-stack multi-vendor e-commerce marketplace inspired by the functional depth and scale of Amazon, engineered with an original modern brand identity, robust micro-architecture, and production-hardened resilience.

---

## 📑 Table of Contents

- [🌟 Architectural Highlights](#-architectural-highlights)
- [✨ Key Features & Modules](#-key-features--modules)
  - [🛒 Customer Storefront](#-customer-storefront)
  - [🏪 Seller Portal (`/seller`)](#-seller-portal-seller)
  - [🛡️ Admin Suite (`/admin`)](#️-admin-suite-admin)
  - [🤖 Grounded AI Intelligence](#-grounded-ai-intelligence)
  - [🔒 Security, Payments & Observability](#-security-payments--observability)
- [🔑 Demo Accounts & Credentials](#-demo-accounts--credentials)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🧪 Automated Test Suite](#-automated-test-suite)
- [📦 Production Build & Docker Deployment](#-production-build--docker-deployment)
- [📂 Project Architecture](#-project-architecture)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🤝 Contributing & License](#-contributing--license)

---

## 🌟 Architectural Highlights

* **3-Tier Role-Based Access Control (RBAC)**: Enforces distinct server-side routing, authorization guards, and isolated data contexts for Customers, Sellers, and Platform Administrators.
* **Resilient Media Architecture**: Universal `<ProductImage />` component with skeleton shimmer placeholders and automatic fallback to an original branded vector placeholder (`/images/product-placeholder.svg`), gracefully handling external CDN failures.
* **Deterministic Order State Machine**: Centralized finite state machine (`lib/orderStateMachine.ts`) with forward/backward validation rules governing all order transitions (`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` | `CANCELLED` | `REFUNDED`).
* **Atomic Inventory Consistency**: Prevents overselling race conditions via atomic Prisma checkout reservations, fulfillment inventory deductions, and automatic return restoration.
* **Normalized Data Model (34 Entities)**: Fully relational schema modeling products, variants, attributes, price histories, stock/price alerts, reviews, shipments, coupons, notifications, and immutable audit logs.
* **Dual Database Engine**:
  - *Development*: Zero-config SQLite (`prisma/schema.prisma`) for instant onboarding.
  - *Production*: PostgreSQL (`prisma/schema.postgresql.prisma` + `docker-compose.yml`) for enterprise deployment.
* **Grounded AI Engine**: Dual-execution AI running on **Google Gemini 2.0 Flash** when configured, backed by an intelligent local database grounding engine that guarantees zero hallucinations.

---

## ✨ Key Features & Modules

### 🛒 Customer Storefront

* **Homepage**: Promotional hero carousels, visual category grid, countdown Flash Deals, Best Sellers, and New Arrivals.
* **Advanced Search & Faceted Filtering**: Real-time filtering by category, price range, brand, star ratings, stock status, and sorting, synchronized with URL query params.
* **Product Detail Page (PDP)**:
  - Interactive multi-image gallery with high-res zoom.
  - Dynamic variant switcher (color, size, storage) with live SKU and stock updates.
  - Comprehensive technical specifications table.
  - Price Drop History indicator.
  - **Notify When Back in Stock**: Customer alert subscription for out-of-stock items.
  - **Set Price Drop Alert**: Threshold alert subscription.
* **Product Spec Comparison (`/compare`)**: Side-by-side comparison matrix comparing pricing, specifications, ratings, seller reputation, and instant add-to-cart.
* **Verified Customer Reviews**: Review submission modal, verified purchase badges, rating breakdown charts, and AI review summarization.
* **Persistent Cart & Wishlist**: Real-time server calculations for subtotal, tiered shipping, tax, and coupon discounts with one-click wishlist transfers.
* **Checkout & Visual Tracking**: Multi-step shipping and payment flow with Stripe test simulator and visual order tracking timeline.

### 🏪 Seller Portal (`/seller`)

* **Executive Vendor Dashboard**: Real-time KPI summary (Gross Revenue, Net Payout, Average Order Value, Total Units Sold, Low-Stock Queue) and interactive Recharts revenue analytics.
* **AI Seller Business Assistant**: Vendor-scoped AI assistant answering natural language questions about low-stock alerts, top-selling SKUs, and replenishment recommendations with strict data isolation.
* **Product Catalog Management**: Create, edit, and moderate SKUs with automated price-change tracking and integrated AI title/description copywriter.
* **Fulfillment Operations**: Assign couriers (FedEx, UPS, DHL, USPS), input tracking numbers, and advance orders through the validated state machine.
* **Inventory Control & CSV Export**: Real-time stock adjustments, transaction auditing, and one-click catalog/order export.

### 🛡️ Admin Suite (`/admin`)

* **Platform Operations**: System-wide Gross Merchandise Value (GMV), 10% platform commission analytics, active seller counts, and conversion rate tracking.
* **Time-Range Filters**: Dynamic filtering across `Today`, `7 Days`, `30 Days`, `90 Days`, `1 Year`, and `All Time`.
* **Seller Onboarding & Moderation**: Review vendor business documents, approve, reject, or suspend seller accounts with audit reason notes.
* **Coupons & Promotions Engine**: Create percentage or fixed-amount promotional codes with expiry dates, minimum spend thresholds, and usage limits.
* **AI Business Intelligence (`/admin/ai-insights`)**: Executive analytics engine returning structured findings, evidence, root causes, and recommended strategic actions.
* **Immutable Audit Trail (`/admin/audit-logs`)**: Searchable, tamper-evident log capturing all sensitive administrative actions, transitions, and policy changes.

### 🤖 Grounded AI Intelligence

* **Conversational Shopping Assistant**: Floating storefront assistant assisting customers with budget-conscious queries, product recommendations, and feature comparisons grounded in live database inventory.
* **Natural Language Catalog Search**: Converts conversational search strings into structured catalog filters.
* **Vendor AI Copywriter**: Automatically generates engaging, SEO-optimized product titles, descriptions, and feature bullet points.
* **Customer Review Synthesis**: Summarizes customer sentiment into pros, cons, and community consensus.

### 🔒 Security, Payments & Observability

* **Stripe Integration & Safe Test Mode**: Real Stripe SDK integration with a built-in Safe Test Mode simulator that executes realistic payment intents (`pi_test_...`) without requiring external credentials.
* **Stripe Webhook Handler (`/api/payments/webhook`)**: Signature verification, in-memory idempotency deduplication, and automated handlers for payment success, failure, and refunds.
* **Token Bucket Rate Limiting (`lib/rateLimit.ts`)**: Built-in protection against brute force and DDoS on authentication, checkout, and AI endpoints.
* **File Upload Validation (`lib/fileValidation.ts`)**: Strict MIME type, file size, and extension sanitization.
* **Transactional Email Engine (`lib/email.ts`)**: 10 responsive HTML email templates for order confirmation, shipping updates, back-in-stock notifications, price alerts, and seller verification.
* **SEO Ready**: Dynamic XML sitemap (`app/sitemap.ts`), `app/robots.ts`, OpenGraph metadata, and structured schema markup.

---

## 🔑 Demo Accounts & Credentials

The application is pre-seeded with rich, realistic data. The login page ([`/login`](http://localhost:3000/login)) includes convenient **1-Click Quick Demo Login** buttons:

| Role | Email | Password | What to Test |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@marketsphere.com` | `AdminPass123!` | Moderate sellers, inspect audit logs, time filters, AI BI |
| **Seller** | `seller@apextech.com` | `SellerPass123!` | Revenue analytics, AI vendor assistant, low stock queue, CSV export |
| **Seller (Pending)**| `seller@lumina.com` | `SellerPass123!` | Review vendor onboarding in `/admin/sellers` |
| **Customer** | `alex.customer@example.com` | `CustomerPass123!` | Add to cart, apply coupon `WELCOME10`, test alerts, compare specs |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15.2](https://nextjs.org/) (App Router, React Server Components, Route Handlers) |
| **Frontend UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **ORM & Database** | [Prisma 6.4](https://www.prisma.io/) (SQLite local, PostgreSQL production) |
| **Authentication** | Custom Stateless JWT with HTTP-only cookies, bcryptjs password hashing |
| **Payments** | [Stripe SDK](https://stripe.com/) + Safe Test Mode Simulator + Webhook handler |
| **AI / LLM** | [Google Gemini 2.0 Flash](https://ai.google.dev/) + Grounded Local Query Engine |
| **Testing** | [Vitest 3.2](https://vitest.dev/) (30 Unit & Integration Tests) |
| **Containerization** | Docker, Docker Compose, Multi-stage Node.js Alpine builds |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites

- **Node.js**: v18.18+ or v20+ (Node v22+ recommended)
- **npm**: v9+

### 2. Clone & Install

```bash
git clone https://github.com/your-username/marketsphere.git
cd marketsphere
npm install
```

### 3. Initialize Database & Seed

MarketSphere defaults to SQLite for instant, zero-configuration local execution:

```bash
# Push Prisma schema to local SQLite database
npm run db:push

# Seed with 32 products, 8 categories, 4 vendors, orders, and reviews
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

> **Note**: To force port 3000 specifically, run `npm run dev:3000`.

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Test Suite

MarketSphere includes a comprehensive Vitest test suite validating business logic, financial math, security isolation, and order state machines:

```bash
npm test
```

### Test Coverage Summary:
```
 ✓ tests/orderStateMachine.test.ts (6 tests)  # Valid transitions, cancellation limits, refund guards
 ✓ tests/sellerIsolation.test.ts   (3 tests)  # Vendor data isolation & available stock logic
 ✓ tests/coupons.test.ts           (5 tests)  # Expiry dates, minimum spend, discount math
 ✓ tests/authRbac.test.ts          (4 tests)  # Salted bcrypt hashing, JWT issuance & verification
 ✓ tests/payments.test.ts          (3 tests)  # Stripe simulation, card validation, idempotency
 ✓ tests/inventory.test.ts         (4 tests)  # Atomic reservations, return restoration, release
 ✓ tests/calculations.test.ts      (5 tests)  # Shipping tiers, tax rules, subtotal aggregation

Test Files  7 passed (7)
Tests       30 passed (30)
```

---

## 📦 Production Build & Docker Deployment

### Local Production Build

```bash
# Compile and verify all 50 static and dynamic routes
npm run build

# Launch production server
npm start
```

### ⚡ Vercel Deployment (Zero-Config / Database-Off Ready)

MarketSphere is engineered to deploy seamlessly to **Vercel** with **zero external database dependencies**:

1. **Import Repository**: Connect your GitHub repository to Vercel.
2. **Environment Variables**: Leave `DATABASE_URL` blank (or omit it entirely).
   - MarketSphere automatically detects when no database is configured and operates in **Database-Off Demo Mode**.
   - Built-in in-memory repository collections (`repositories/demo/`) serve all 32 realistic products, 8 categories, 4 sellers, simulated customer orders, and reviews.
   - All 56 routes—including checkout, shipment tracking, `/categories`, `/products`, seller analytics, and admin management—render with zero runtime crashes or 404s.
3. **Deploy**: Click **Deploy**. Next.js will compile all static and dynamic pages with 0 errors.

> [!TIP]
> **Enabling a Live PostgreSQL Database Later:**
> When ready for persistent PostgreSQL (e.g. Neon, Supabase, or AWS RDS), simply add `DATABASE_URL="postgresql://..."` in your Vercel Project Settings and run `npx prisma db push`. The platform automatically switches from demo repository mode to live Prisma execution with zero code changes!

### Docker Deployment with PostgreSQL

To run MarketSphere alongside a dedicated PostgreSQL instance using Docker Compose:

```bash
# Start PostgreSQL and MarketSphere containers
docker compose up --build -d

# Sync Prisma schema to PostgreSQL
docker compose exec web npx prisma db push --schema=prisma/schema.postgresql.prisma

# Seed PostgreSQL with demo catalog
docker compose exec web npm run db:seed
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Architecture

```
marketsphere/
├── app/
│   ├── (storefront)
│   │   ├── page.tsx                    # Storefront homepage
│   │   ├── search/page.tsx             # Faceted catalog search & filter
│   │   ├── products/[slug]/            # PDP: Gallery, variants, reviews, alerts
│   │   ├── compare/page.tsx            # Multi-product specification comparison
│   │   ├── cart/page.tsx               # Cart, coupons & shipping tiers
│   │   ├── checkout/page.tsx           # Multi-step checkout & payment simulator
│   │   ├── order-confirmation/[id]/    # Order confirmation & receipt
│   │   ├── orders/[id]/track/          # Visual shipment tracking timeline
│   │   └── wishlist/page.tsx           # Customer wishlist
│   ├── account/                        # Customer profile, orders, notifications
│   ├── admin/                          # Admin Suite (Dashboard, Sellers, Users, Coupons, Logs, AI)
│   ├── seller/                         # Seller Portal (Dashboard, Products, Orders, Inventory)
│   ├── api/                            # 28+ Modular REST API Route Handlers
│   ├── robots.ts                       # SEO Crawler configuration
│   └── sitemap.ts                      # Dynamic XML Sitemap generator
├── components/
│   ├── ai/                             # Shopping Assistant, Natural Search, Review Summarizer
│   ├── layout/                         # Header, Footer, navigation bars
│   ├── product/                        # Product comparison, review widgets
│   ├── seller/                         # AI Vendor Assistant, inventory tables
│   ├── storefront/                     # Product cards, hero banners, category grids
│   └── ui/                             # Resilient ProductImage, buttons, modals, badges
├── lib/
│   ├── ai.ts                           # Grounded AI engine (Gemini + local fallback)
│   ├── auth.ts                         # JWT auth, bcrypt hashing, RBAC helpers
│   ├── currency.ts                     # Price formatting, shipping rules, tax calculations
│   ├── db.ts                           # Prisma Client singleton
│   ├── email.ts                        # 10 Responsive HTML transactional email templates
│   ├── fileValidation.ts               # File upload size & MIME type validator
│   ├── orderStateMachine.ts            # Centralized order lifecycle state machine
│   ├── rateLimit.ts                    # In-memory token bucket rate limiter
│   └── stripe.ts                       # Stripe SDK & Safe Test Mode payment simulator
├── prisma/
│   ├── schema.prisma                   # SQLite schema (development)
│   ├── schema.postgresql.prisma        # PostgreSQL schema (production)
│   └── seed.ts                         # Comprehensive realistic seed dataset
├── services/
│   ├── cartService.ts                  # Cart calculations & coupon rules
│   ├── inventoryService.ts             # Atomic stock reservations & deductions
│   ├── orderService.ts                 # Order lifecycle & state enforcement
│   └── recommendationService.ts        # Personalized recommendation engine
├── public/
│   └── images/product-placeholder.svg  # Branded vector placeholder graphic
├── tests/                              # 7 Vitest test suites (30 tests)
├── vitest.config.ts                    # Vitest path alias & runner configuration
├── docker-compose.yml                  # Production Docker orchestration
└── Dockerfile                          # Multi-stage production container build
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (a pre-configured `.env` is provided):

```env
# Database Configuration
DATABASE_URL="file:./prisma/marketsphere.db"

# JWT Authentication
JWT_SECRET="marketsphere-super-secure-jwt-secret-key-2026-prod"
JWT_EXPIRES_IN="7d"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Google Gemini API (defaults to local grounded database engine if omitted)
GEMINI_API_KEY=""

# Optional: Stripe Keys (defaults to Safe Test Mode Simulator if omitted)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

This project is licensed under the **MIT License**.
