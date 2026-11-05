# ResizeForForm 🇮🇳

> Production-ready, client-side photo, signature, and PDF optimizer built for Indian government exam applications (SSC, IBPS, SBI, UPSC, NEET, CUET, RRB, Passport, UPPSC).
> **100% Client-Side:** Photos and documents never leave the user's phone or computer.

---

## 🚀 Key Features

- **Exact Specification Presets:** Pre-configured dimensions (pixels) and strict file size boundaries (min KB – max KB) for India's largest competitive recruitment exams.
- **Client-Side Binary Search JPEG Compression:** Uses HTML5 Canvas and binary search on compression quality (0.10 to 0.95, step 0.01) to maximize visual quality while strictly guaranteeing file sizes stay under the portal's ceiling.
- **High-Quality Multi-Step Downscaling:** Progressive halving step-down algorithm prevents blur and aliasing artifacts when downscaling 15-20 MB phone camera photos to small passport dimensions (e.g. 100×120 px).
- **HEIC / HEIF Decoding:** Automatic client-side conversion for photos taken on modern iPhones via dynamic `heic2any`.
- **Signature Cleanup Tool:** Auto-contrast histogram stretching and background thresholding to turn dimly lit paper signatures into crisp, high-contrast black ink on pure white `#ffffff` backgrounds.
- **Client-Side PDF Compressor:** Re-encodes embedded image streams and strips metadata inside scanned marksheets and caste certificates to target under 100 KB, 200 KB, or 300 KB without uploading to any server.
- **Zero Layout Shift & System Fonts:** Native system font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) ensures instantaneous First Contentful Paint (FCP) and optimal Core Web Vitals on budget Android devices.
- **Offline Capable (PWA):** Lightweight Service Worker caches core assets so the application continues to work without an active internet connection after initial load.
- **SEO-Optimized Static Pages:** Programmatic static generation (`output: 'export'`) for every exam preset, hub pages (`/exams`, `/compress-pdf`), and target size landing pages (`/photo-resize-to-50kb`, `/signature-resize-to-20kb`). Includes Schema.org `WebApplication`, `FAQPage`, and `BreadcrumbList` JSON-LD.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Quickstart
```bash
# Clone and enter project directory
cd resizeforform

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to test the app locally.

### Production Static Build
```bash
npm run build
```
The production bundle will be exported to the `.next` / `out` directory.

---

## 📋 Adding a New Exam Preset

Adding a new exam requires editing **only one file**: [`src/data/presets.ts`](src/data/presets.ts). All programmatic landing pages, category listings, breadcrumbs, schema markup, and sitemap entries will be automatically generated.

```typescript
// Example preset in src/data/presets.ts:
{
  id: 'bpsc-tre-photo',
  slug: 'bpsc-tre-photo-resize-20-50kb',
  examName: 'BPSC Teacher Recruitment (TRE)',
  examShortName: 'BPSC TRE',
  organization: 'Bihar Public Service Commission',
  documentType: 'photo',
  width: 250,
  height: 250,
  minKB: 20,
  maxKB: 50,
  format: 'jpg',
  sourceUrl: 'https://bpsc.bih.nic.in',
  lastVerified: '2026-11-01',
  verified: false, // Set false if not confirmed from latest brochure
  notes: 'TODO: Verify aspect ratio and live webcam requirement from current notification.',
  category: 'state',
}
```

*Note: Whenever you add a spec you haven't confirmed against the latest official notification brochure, mark `verified: false` and add a `TODO` in `notes`. The page will automatically display an official verification alert.*

---

## 🚀 Deploying to Vercel (Zero-Config)

This repository is built with standard Next.js App Router static export (`output: 'export'`) and requires **zero server environment variables** or backend services.

### Option 1: Git Import (Recommended)
1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and select the repository.
3. Keep default settings:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: default
4. Click **Deploy**. Vercel will automatically build and distribute the site across its global Edge CDN.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## 🔍 What You Must Verify Manually Before Launch

1. **Verify Unconfirmed Specs (`verified: false`):**
   - [ ] **NEET UG Photo & Signature:** Verify if NTA still requires postcard size (4"×6", 10-200 KB) or 200×200 px.
   - [ ] **CUET UG Photo:** Verify NTA's recent resolution guidelines on `cuet.nta.nic.in`.
   - [ ] **UPSC CSE Photo & Signature:** Confirm dimensions on `upsconline.nic.in` (currently allows 350×350 to 1000×1000 px, 20–300 KB).
   - [ ] **UPPSC PCS Photo:** Confirm dimensions on `uppsc.up.nic.in`.
   - [ ] **Passport Seva Photo:** Check latest Passport Seva portal guidelines (350×350 px, 3.5×3.5 cm, white background).
2. **Set Production Domain in Sitemap:**
   - Update `SITE_URL` in [`src/app/sitemap.ts`](src/app/sitemap.ts) to match your final domain (e.g. `https://resizeforform.com`).
3. **Contact Email:**
   - Update the contact address in [`src/app/privacy/page.tsx`](src/app/privacy/page.tsx) and [`src/components/Footer.tsx`](src/components/Footer.tsx).
4. **AdSense Integration (Optional in future):**
   - When ready for monetization, uncomment and place your script tag in [`src/components/AdSlot.tsx`](src/components/AdSlot.tsx).

---

## 🚀 Launch Checklist & First 15 Exam Pages to Publish

- [x] Verify static build passes cleanly (`npm run build`)
- [x] Test responsive layouts on mobile (360px Android viewport) and desktop
- [x] Verify 100% client-side privacy (check browser Network tab — 0 bytes sent during resize)
- [x] Verify offline service worker caching
- [ ] Connect custom production domain on Vercel
- [ ] Submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console)

### 📌 First 15 Exam Pages Ready for Indexing:

| # | Exam & Document Type | Target Dimensions | Target Size | URL Slug | Status |
|---|---|---|---|---|---|
| 1 | **SSC CGL Photo** | 100 × 120 px | 20 – 50 KB | `/ssc-cgl-photo-resize-20-50kb` | Verified ✅ |
| 2 | **SSC CGL Signature** | 140 × 60 px | 10 – 20 KB | `/ssc-cgl-signature-resize-10-20kb` | Verified ✅ |
| 3 | **SSC CHSL Photo** | 100 × 120 px | 20 – 50 KB | `/ssc-chsl-photo-resize-20-50kb` | Verified ✅ |
| 4 | **SSC CHSL Signature** | 140 × 60 px | 10 – 20 KB | `/ssc-chsl-signature-resize-10-20kb` | Verified ✅ |
| 5 | **IBPS PO Photo** | 200 × 230 px | 20 – 50 KB | `/ibps-po-photo-resize-20-50kb` | Verified ✅ |
| 6 | **IBPS PO Signature** | 140 × 60 px | 10 – 20 KB | `/ibps-po-signature-resize-10-20kb` | Verified ✅ |
| 7 | **IBPS Clerk Photo** | 200 × 230 px | 20 – 50 KB | `/ibps-clerk-photo-resize-20-50kb` | Verified ✅ |
| 8 | **IBPS Clerk Signature** | 140 × 60 px | 10 – 20 KB | `/ibps-clerk-signature-resize-10-20kb` | Verified ✅ |
| 9 | **SBI PO Photo** | 200 × 230 px | 20 – 50 KB | `/sbi-po-photo-resize-20-50kb` | Verified ✅ |
| 10 | **SBI PO Signature** | 140 × 60 px | 10 – 20 KB | `/sbi-po-signature-resize-10-20kb` | Verified ✅ |
| 11 | **RRB NTPC Photo** | 100 × 120 px | 20 – 50 KB | `/rrb-ntpc-photo-resize-20-50kb` | Verified ✅ |
| 12 | **RRB NTPC Signature** | 140 × 60 px | 10 – 20 KB | `/rrb-ntpc-signature-resize-10-20kb` | Verified ✅ |
| 13 | **NEET UG Photo** | 200 × 200 px | 10 – 200 KB | `/neet-photo-resize-10-200kb` | Check notification ⚠️ |
| 14 | **NEET UG Signature** | 200 × 80 px | 4 – 30 KB | `/neet-signature-resize-4-30kb` | Check notification ⚠️ |
| 15 | **UPSC CSE Photo** | 150 × 200 px | 20 – 300 KB | `/upsc-cse-photo-resize-20-300kb` | Check notification ⚠️ |

### 🎯 Key Hub & Category Landing Pages:
- Generic Live Resizer: `/`
- Directory of All Exam Specifications: `/exams`
- Client-Side PDF Compressor Tool: `/compress-pdf`
- Photo Resize to 50 KB Hub: `/photo-resize-to-50kb`
- Photo Resize to 200 KB Hub: `/photo-resize-to-200kb`
- Signature Resize to 20 KB Hub: `/signature-resize-to-20kb`
- Signature Resize to 30 KB Hub: `/signature-resize-to-30kb`

---

## 📄 License
MIT © ResizeForForm
