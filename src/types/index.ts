/* ───────────────────────────────────────────────────
 *  ResizeForForm – shared types
 * ─────────────────────────────────────────────────── */

/** Supported output image formats */
export type ImageFormat = 'jpg' | 'png';

/** Kind of document the preset targets */
export type DocumentType = 'photo' | 'signature' | 'thumb';

/** Exam category for grouping / filtering */
export type ExamCategory =
  | 'ssc'
  | 'banking'
  | 'upsc'
  | 'nta'
  | 'railway'
  | 'state'
  | 'identity'
  | 'other';

/* ── Preset ─────────────────────────────────────── */

export interface Preset {
  /** Unique machine-readable id, e.g. "ssc-cgl-photo" */
  id: string;
  /** URL-safe slug used as the page path, e.g. "ssc-cgl-photo-resize-20-50kb" */
  slug: string;
  /** Full exam / form name, e.g. "SSC CGL 2024" */
  examName: string;
  /** Short label, e.g. "SSC CGL" */
  examShortName: string;
  /** Conducting body, e.g. "Staff Selection Commission" */
  organization: string;
  /** What the user is resizing */
  documentType: DocumentType;
  /** Target width in pixels */
  width: number;
  /** Target height in pixels */
  height: number;
  /** Minimum file size in KB (some forms reject below this) */
  minKB: number;
  /** Maximum file size in KB */
  maxKB: number;
  /** Required output format */
  format: ImageFormat;
  /** Link to the official notification / spec */
  sourceUrl: string;
  /** ISO date when we last checked the spec */
  lastVerified: string;
  /** true = spec confirmed from an official source */
  verified: boolean;
  /** Free-text notes shown to the user */
  notes: string;
  /** Grouping category */
  category: ExamCategory;
}

/* ── Category page descriptor ───────────────────── */

export interface CategoryPage {
  slug: string;
  title: string;
  heading: string;
  description: string;
  /** Filter function key: matches presets by documentType + maxKB */
  documentType: DocumentType;
  maxKB: number;
}

/* ── Processing ─────────────────────────────────── */

export interface ProcessingOptions {
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  format: ImageFormat;
  /** Crop area from react-easy-crop (if user cropped) */
  cropArea?: CropArea;
  /** Enable signature cleanup (auto-contrast + white bg) */
  signatureCleanup?: boolean;
  /** Optional exam short name for filename generation */
  examShortName?: string;
  /** Optional document type for filename generation */
  documentType?: DocumentType | string;
  /** Optional custom filename */
  filename?: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProcessingResult {
  /** The processed image as a Blob */
  blob: Blob;
  /** Data URL for preview */
  dataUrl: string;
  /** Final width */
  width: number;
  /** Final height */
  height: number;
  /** File size in bytes */
  sizeBytes: number;
  /** File size in KB (rounded to 1 decimal) */
  sizeKB: number;
  /** JPEG quality used (0-1), or null for PNG */
  quality: number | null;
  /** Suggested download filename */
  filename: string;
}

export interface ProcessingError {
  type: 'too-large' | 'too-small' | 'unsupported' | 'generic';
  message: string;
  suggestion: string;
}
