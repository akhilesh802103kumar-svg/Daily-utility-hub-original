# Daily Utility Hub – All in One Website

> **Everyday Digital Tools, All in One Place.**
> High-performance, client-side, mobile-first utility platform built with React, TypeScript, and Tailwind CSS.

---

## 1. Project Overview

Daily Utility Hub is a unified suite of essential digital productivity tools. Designed with a privacy-first architecture, all file manipulation (PDF merging/splitting/compression, image optimization, QR code generation, and invitation card rendering) is performed **directly inside the user's browser**. No user documents, photos, or sensitive files are uploaded to or stored on remote servers.

### Brand Identity & Palette
- **Primary Blue**: `#1456D9`
- **Royal Purple**: `#6D35D5`
- **Accent Orange**: `#FF9D24`
- **Background**: `#F5F7FC`
- **Dark Text**: `#172554`
- **Muted Slate**: `#64748B`

---

## 2. Tools & Features

### Active Tools (6 Core Utilities)

1. **All-in-One PDF Tools (`/tools/pdf`)**
   - Merge multiple PDF documents (up to 10 files in queue).
   - Split PDF by custom page range (e.g., `1-3`, `5`) or extract all pages as individual files in a ZIP.
   - Compress PDF with Low, Medium, and High compression presets using stream object stripping.
   - JPG to PDF & PNG to PDF batch conversion with A4 pagination.
   - PDF to JPG page extraction (download as ZIP or single image).
   - Interactive high-fidelity PDF page preview with zoom controls.
   - Safe file size limits (50 MB limit) and automatic blob memory cleanup.

2. **Image Compressor & Converter (`/tools/image-compressor`)**
   - High-quality image compression for JPG, PNG, and WebP.
   - Format cross-conversion (JPG to PNG, PNG to JPG, to WebP).
   - Target File Size mode: Binary search algorithm computes optimum quality to hit an exact KB target.
   - Batch queue processing with progress tracking.
   - Download individual compressed images or batch export all images as a `.zip` archive.
   - Safe file threshold (30 MB limit, max 15 images) to protect 2GB/3GB RAM Android phones.

3. **Keyword Generator (`/tools/keyword-generator`)**
   - Seed keyword expansion into Related, Long-Tail, and Question-based variations.
   - Search intent classification (Informational, Commercial, Transactional, Navigational).
   - Multi-language filtering (English, Hindi, Spanish, French, German, Arabic, Japanese).
   - Regional targeting presets (India ₹, US, UK, Canada, Australia, Germany, UAE, Global).
   - One-click copy for individual terms, Copy All, and instant CSV / TXT export.
   - Ready for future SEO API hookup; no fake search volume data.

4. **Financial Calculator (`/tools/financial-calculator`)**
   - 8 Indian Rupee (₹) calculators:
     - **GST Calculator**: Inclusive and exclusive mode with 5%, 12%, 18%, 28% slabs + CGST/SGST split.
     - **Percentage Calculator**: 3 mathematical modes (X% of Y, X is what % of Y, percentage increase/decrease).
     - **EMI Calculator**: Home/Car loan monthly payment, interest burden, and interactive amortization bar.
     - **Loan Comparison**: Compare side-by-side repayment totals across different tenures.
     - **Simple Interest (SI)** & **Compound Interest (CI)**: With frequency selection (annually, semi-annually, quarterly, monthly).
     - **Discount & Savings**: Compute original price, discount amount, and final checkout price.
     - **Income Tax Estimator**: Financial Year calculation with Old vs New tax regimes.

5. **Digital Invitation Maker (`/tools/invitation-maker`)**
   - **52 Unique Designer Templates** across 8 occasions:
     - Wedding, Birthday, Anniversary, Engagement, Baby Shower, Housewarming, Religious/Festivals, and General Events.
   - **10 Free Forever Templates**: Fully customizable, downloadable as 2x Retina PNG and print-ready A5 PDF via `jsPDF`.
   - **42 Locked Premium Templates**: Previewable with dedicated modal: *"Premium Template – Subscription Coming Soon"*.
   - Mobile-optimized editor with font selector, color themes, and WhatsApp invitation text generator.

6. **QR Code Generator (`/tools/qr-generator`)**
   - Supports 7 payloads: Website URL, Raw Text, WhatsApp (pre-filled chat), Wi-Fi (WPA/WEP/nopass), Email, Phone Number, and Compact Photo QR.
   - Center Website Logo embedding with Level H error-correction (30% recovery capability).
   - Custom foreground/background colors and resolution selector.
   - Export to PNG and vector SVG with embedded logo badge.

### Roadmap (9 Coming Soon Tools)
Cards and preview modals for:
1. Invoice & Billing Generator
2. AI Resume & CV Maker
3. YouTube Thumbnail Maker
4. Age Calculator
5. Unit Converter
6. Online Image Editor
7. Text to Speech
8. Quiz & Exam Practice
9. Restaurant QR Menu & Ordering

---

## 3. Development Setup

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd daily-utility-hub

# Install dependencies
npm install
```

### Running Locally
```bash
# Starts the Vite development server on port 3000
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 4. Build Commands

```bash
# Typecheck with TypeScript compiler
npm run lint

# Production build (outputs static bundle to dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Cloudflare Pages Deployment Steps

Daily Utility Hub is fully optimized for **Cloudflare Pages** (JAMstack static site hosting):

1. **Connect Git Repository**:
   - In Cloudflare Dashboard, navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your Daily Utility Hub repository.

2. **Configure Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave blank or set to `/`)

3. **Routing & Headers**:
   - `public/_redirects` is already included:
     ```
     /*    /index.html   200
     ```
     This enables client-side routing (`/tools/pdf`, `/tools/invitation-maker`, etc.) without 404 errors on page refresh.
   - `public/_headers` enforces security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and cache policies for static assets).

4. **Deploy**:
   - Click **Save and Deploy**. Cloudflare Pages will build and deploy the application globally across Cloudflare's edge network.

---

## 6. Required Environment Variables

Configure environment variables in Cloudflare Pages under **Settings** > **Environment variables**:

| Variable Name | Purpose | Required in Phase 1 |
|---|---|---|
| `APP_URL` | Canonical app URL (e.g. `https://dailyutilityhub.pages.dev`) | Recommended |
| `GEMINI_API_KEY` | Optional server-side API key for future AI tools | Optional |

> **Security Note:** Never commit `.env` or real API keys to version control. Keep all private keys in your hosting platform's secrets manager.

---

## 7. Future Firebase Integration Architecture

The codebase contains pre-architected service interfaces in `src/services/firebase/`:
- `types.ts`: UserProfile, SubscriptionStatus, RestaurantData, and SavedInvitation models.
- `auth.ts`: Authentication contract with custom claims handling.
- `firestore.ts`: Isolation contracts ensuring users only query their own data, and restaurant owners only access their own menus.
- `storage.ts`: File upload guidelines with client-side byte limit checks.
- `security.ts`: Firestore Security Rules version 2 blueprint and RBAC policy.

### Phase 2 Firebase Checklist
1. Provision Firebase project via Google Cloud / Firebase Console.
2. Initialize Firebase SDK in `src/services/firebase/config.ts`.
3. Deploy the security rules blueprint documented in `src/services/firebase/security.ts`.
4. Configure Cloud Functions for server-side payment verification (Razorpay/Stripe webhooks).
5. Set custom user claims (`admin`) exclusively through the Firebase Admin SDK on the backend.
