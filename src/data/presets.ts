/* ───────────────────────────────────────────────────
 *  ResizeForForm – Exam presets
 *
 *  ⚠  ADDING A NEW EXAM: just add an object below.
 *     Pages, sitemap, and SEO are auto-generated.
 *
 *  Set  verified: false  and add a TODO in `notes`
 *  for any spec you haven't confirmed from the
 *  official notification PDF / website.
 * ─────────────────────────────────────────────────── */

import { Preset, CategoryPage, ExamCategory } from '@/types';

export const presets: Preset[] = [
  /* ── SSC ────────────────────────────────────────── */
  {
    id: 'ssc-cgl-photo',
    slug: 'ssc-cgl-photo-resize-20-50kb',
    examName: 'SSC CGL',
    examShortName: 'SSC CGL',
    organization: 'Staff Selection Commission',
    documentType: 'photo',
    width: 100,
    height: 120,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://ssc.gov.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Passport-size photograph with white background. Face should cover 60-70% of the frame.',
    category: 'ssc',
  },
  {
    id: 'ssc-cgl-signature',
    slug: 'ssc-cgl-signature-resize-10-20kb',
    examName: 'SSC CGL',
    examShortName: 'SSC CGL',
    organization: 'Staff Selection Commission',
    documentType: 'signature',
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    format: 'jpg',
    sourceUrl: 'https://ssc.gov.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Sign on white paper with a black or dark blue pen. Do not use all caps.',
    category: 'ssc',
  },
  {
    id: 'ssc-chsl-photo',
    slug: 'ssc-chsl-photo-resize-20-50kb',
    examName: 'SSC CHSL',
    examShortName: 'SSC CHSL',
    organization: 'Staff Selection Commission',
    documentType: 'photo',
    width: 100,
    height: 120,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://ssc.gov.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Same specs as SSC CGL. Recent passport-size photograph on white background.',
    category: 'ssc',
  },
  {
    id: 'ssc-chsl-signature',
    slug: 'ssc-chsl-signature-resize-10-20kb',
    examName: 'SSC CHSL',
    examShortName: 'SSC CHSL',
    organization: 'Staff Selection Commission',
    documentType: 'signature',
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    format: 'jpg',
    sourceUrl: 'https://ssc.gov.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Same specs as SSC CGL. Sign with black/dark blue ink on white paper.',
    category: 'ssc',
  },

  /* ── IBPS ───────────────────────────────────────── */
  {
    id: 'ibps-po-photo',
    slug: 'ibps-po-photo-resize-20-50kb',
    examName: 'IBPS PO',
    examShortName: 'IBPS PO',
    organization: 'Institute of Banking Personnel Selection',
    documentType: 'photo',
    width: 200,
    height: 230,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://www.ibps.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Recent passport-size colour photograph. Light background preferred.',
    category: 'banking',
  },
  {
    id: 'ibps-po-signature',
    slug: 'ibps-po-signature-resize-10-20kb',
    examName: 'IBPS PO',
    examShortName: 'IBPS PO',
    organization: 'Institute of Banking Personnel Selection',
    documentType: 'signature',
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    format: 'jpg',
    sourceUrl: 'https://www.ibps.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Sign on white paper with black ink pen.',
    category: 'banking',
  },
  {
    id: 'ibps-clerk-photo',
    slug: 'ibps-clerk-photo-resize-20-50kb',
    examName: 'IBPS Clerk',
    examShortName: 'IBPS Clerk',
    organization: 'Institute of Banking Personnel Selection',
    documentType: 'photo',
    width: 200,
    height: 230,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://www.ibps.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Same specifications as IBPS PO. Recent passport-size colour photograph.',
    category: 'banking',
  },
  {
    id: 'ibps-clerk-signature',
    slug: 'ibps-clerk-signature-resize-10-20kb',
    examName: 'IBPS Clerk',
    examShortName: 'IBPS Clerk',
    organization: 'Institute of Banking Personnel Selection',
    documentType: 'signature',
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    format: 'jpg',
    sourceUrl: 'https://www.ibps.in',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Same specifications as IBPS PO. Black ink on white unruled paper.',
    category: 'banking',
  },
  {
    id: 'sbi-po-photo',
    slug: 'sbi-po-photo-resize-20-50kb',
    examName: 'State Bank of India (SBI) PO',
    examShortName: 'SBI PO',
    organization: 'State Bank of India',
    documentType: 'photo',
    width: 200,
    height: 230,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://sbi.co.in/web/careers',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Recent passport-size colour picture against a light-coloured, preferably white, background.',
    category: 'banking',
  },
  {
    id: 'sbi-po-signature',
    slug: 'sbi-po-signature-resize-10-20kb',
    examName: 'State Bank of India (SBI) PO',
    examShortName: 'SBI PO',
    organization: 'State Bank of India',
    documentType: 'signature',
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    format: 'jpg',
    sourceUrl: 'https://sbi.co.in/web/careers',
    lastVerified: '2026-10-01',
    verified: true,
    notes: 'Sign on white paper with black ink pen. Signatures in capital letters are strictly rejected.',
    category: 'banking',
  },

  /* ── RRB (Railway) ──────────────────────────────── */
  {
    id: 'rrb-ntpc-photo',
    slug: 'rrb-ntpc-photo-resize-20-50kb',
    examName: 'RRB NTPC',
    examShortName: 'RRB NTPC',
    organization: 'Railway Recruitment Board',
    documentType: 'photo',
    width: 100,
    height: 120,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://www.rrbcdg.gov.in',
    lastVerified: '2026-09-15',
    verified: true,
    notes: 'Colour passport photograph with white or light background. No caps or goggles.',
    category: 'railway',
  },
  {
    id: 'rrb-ntpc-signature',
    slug: 'rrb-ntpc-signature-resize-10-20kb',
    examName: 'RRB NTPC',
    examShortName: 'RRB NTPC',
    organization: 'Railway Recruitment Board',
    documentType: 'signature',
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    format: 'jpg',
    sourceUrl: 'https://www.rrbcdg.gov.in',
    lastVerified: '2026-09-15',
    verified: true,
    notes: 'Sign on white paper using black or dark blue ink pen.',
    category: 'railway',
  },

  /* ── NTA (NEET, CUET) ───────────────────────────── */
  {
    id: 'neet-photo',
    slug: 'neet-photo-resize-10-200kb',
    examName: 'NEET UG',
    examShortName: 'NEET',
    organization: 'National Testing Agency',
    documentType: 'photo',
    width: 200,
    height: 200,
    minKB: 10,
    maxKB: 200,
    format: 'jpg',
    sourceUrl: 'https://neet.nta.nic.in',
    lastVerified: '2026-09-01',
    verified: false,
    notes: 'TODO: Verify exact pixel dimensions from latest NTA notification. Postcard-size photograph, white background.',
    category: 'nta',
  },
  {
    id: 'neet-signature',
    slug: 'neet-signature-resize-4-30kb',
    examName: 'NEET UG',
    examShortName: 'NEET',
    organization: 'National Testing Agency',
    documentType: 'signature',
    width: 200,
    height: 80,
    minKB: 4,
    maxKB: 30,
    format: 'jpg',
    sourceUrl: 'https://neet.nta.nic.in',
    lastVerified: '2026-09-01',
    verified: false,
    notes: 'TODO: Verify pixel dimensions from latest NTA notification. Black ink on white paper.',
    category: 'nta',
  },
  {
    id: 'cuet-photo',
    slug: 'cuet-photo-resize-10-200kb',
    examName: 'CUET UG',
    examShortName: 'CUET',
    organization: 'National Testing Agency',
    documentType: 'photo',
    width: 200,
    height: 200,
    minKB: 10,
    maxKB: 200,
    format: 'jpg',
    sourceUrl: 'https://cuet.nta.nic.in',
    lastVerified: '2026-09-01',
    verified: false,
    notes: 'TODO: Verify exact specs from latest NTA CUET notification. Recent passport-size photo, white background.',
    category: 'nta',
  },

  /* ── UPSC ───────────────────────────────────────── */
  {
    id: 'upsc-cse-photo',
    slug: 'upsc-cse-photo-resize-20-300kb',
    examName: 'UPSC Civil Services (IAS/IPS)',
    examShortName: 'UPSC CSE',
    organization: 'Union Public Service Commission',
    documentType: 'photo',
    width: 150,
    height: 200,
    minKB: 20,
    maxKB: 300,
    format: 'jpg',
    sourceUrl: 'https://upsconline.nic.in',
    lastVerified: '2026-08-01',
    verified: false,
    notes: 'TODO: Verify exact pixel dimensions from latest UPSC notification. Photo should be recent, clear, and on a white/light background.',
    category: 'upsc',
  },
  {
    id: 'upsc-cse-signature',
    slug: 'upsc-cse-signature-resize-20-300kb',
    examName: 'UPSC Civil Services (IAS/IPS)',
    examShortName: 'UPSC CSE',
    organization: 'Union Public Service Commission',
    documentType: 'signature',
    width: 150,
    height: 80,
    minKB: 20,
    maxKB: 300,
    format: 'jpg',
    sourceUrl: 'https://upsconline.nic.in',
    lastVerified: '2026-08-01',
    verified: false,
    notes: 'TODO: Verify exact pixel dimensions from latest UPSC notification. Black ink pen on white paper.',
    category: 'upsc',
  },

  /* ── Indian Passport ────────────────────────────── */
  {
    id: 'passport-photo',
    slug: 'indian-passport-photo-resize',
    examName: 'Indian Passport',
    examShortName: 'Passport',
    organization: 'Ministry of External Affairs',
    documentType: 'photo',
    width: 350,
    height: 350,
    minKB: 10,
    maxKB: 300,
    format: 'jpg',
    sourceUrl: 'https://www.passportindia.gov.in',
    lastVerified: '2026-08-01',
    verified: false,
    notes: 'TODO: Verify from Passport Seva portal. Typically 3.5 cm × 3.5 cm, white background, front-facing, 80% face coverage.',
    category: 'identity',
  },

  /* ── State PSC ──────────────────────────────────── */
  {
    id: 'uppsc-photo',
    slug: 'uppsc-photo-resize-20-50kb',
    examName: 'UP PCS (UPPSC)',
    examShortName: 'UPPSC',
    organization: 'Uttar Pradesh Public Service Commission',
    documentType: 'photo',
    width: 100,
    height: 120,
    minKB: 20,
    maxKB: 50,
    format: 'jpg',
    sourceUrl: 'https://uppsc.up.nic.in',
    lastVerified: '2026-08-01',
    verified: false,
    notes: 'TODO: Verify from latest UPPSC notification. Generally follows SSC-style specs.',
    category: 'state',
  },
];

/* ── Category pages ─────────────────────────────── */

export const categoryPages: CategoryPage[] = [
  {
    slug: 'photo-resize-to-50kb',
    title: 'Resize Photo to Under 50 KB for Government Forms',
    heading: 'Photo Resize to 50 KB',
    description:
      'Resize and compress your passport photo to under 50 KB for SSC, IBPS, RRB, and other government exam forms. Free online tool — no upload to server.',
    documentType: 'photo',
    maxKB: 50,
  },
  {
    slug: 'photo-resize-to-200kb',
    title: 'Resize Photo to Under 200 KB for NTA & UPSC Forms',
    heading: 'Photo Resize to 200 KB',
    description:
      'Compress your photo to under 200 KB for NEET, CUET, UPSC, and other exam applications. Works on your phone — your photo never leaves your device.',
    documentType: 'photo',
    maxKB: 200,
  },
  {
    slug: 'signature-resize-to-20kb',
    title: 'Resize Signature to Under 20 KB for Government Forms',
    heading: 'Signature Resize to 20 KB',
    description:
      'Resize and compress your scanned signature to under 20 KB (JPG) for SSC, IBPS, RRB, and other exam forms. 100% client-side — nothing is uploaded.',
    documentType: 'signature',
    maxKB: 20,
  },
  {
    slug: 'signature-resize-to-30kb',
    title: 'Resize Signature to Under 30 KB for NTA Forms',
    heading: 'Signature Resize to 30 KB',
    description:
      'Compress your scanned signature to under 30 KB for NEET, CUET, and other NTA exam forms. Free, private, works offline.',
    documentType: 'signature',
    maxKB: 30,
  },
];

/* ── Helpers ────────────────────────────────────── */

export function getPresetBySlug(slug: string): Preset | undefined {
  return presets.find((p) => p.slug === slug);
}

export function getPresetById(id: string): Preset | undefined {
  return presets.find((p) => p.id === id);
}

export function getPresetsByCategory(category: string): Preset[] {
  return presets.filter((p) => p.category === category);
}

export function getPresetsByDocumentType(type: string): Preset[] {
  return presets.filter((p) => p.documentType === type);
}

export function getCategoryBySlug(slug: string): CategoryPage | undefined {
  return categoryPages.find((c) => c.slug === slug);
}

export function getPresetsForCategory(cat: CategoryPage): Preset[] {
  return presets.filter(
    (p) => p.documentType === cat.documentType && p.maxKB <= cat.maxKB
  );
}

/** All slugs that the [slug] dynamic route should generate */
export function getAllPageSlugs(): string[] {
  const examSlugs = presets.map((p) => p.slug);
  const catSlugs = categoryPages.map((c) => c.slug);
  return [...examSlugs, ...catSlugs];
}

/** Group presets by exam (multiple docs per exam) */
export function getRelatedPresets(preset: Preset): Preset[] {
  return presets.filter(
    (p) => p.examShortName === preset.examShortName && p.id !== preset.id
  );
}

/** Get unique exam names for display */
export function getUniqueExams(): { name: string; shortName: string; category: ExamCategory; presets: Preset[] }[] {
  const map = new Map<string, Preset[]>();
  for (const p of presets) {
    const key = p.examShortName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).map(([, ps]) => ({
    name: ps[0].examName,
    shortName: ps[0].examShortName,
    category: ps[0].category,
    presets: ps,
  }));
}


