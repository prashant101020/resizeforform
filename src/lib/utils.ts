/**
 * Utility functions for ResizeForForm.
 * Provides file formatting, slugification, filename generation, and image helpers.
 */

/**
 * Formats a file size in bytes to a human-readable string (e.g. "23.5 KB" or "1.2 MB").
 *
 * @param bytes - Size in bytes
 * @returns Human-readable string representation of file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0 || isNaN(bytes)) {
    return '0 KB';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Converts a string into a URL-safe lowercase slug (e.g. "SSC CGL" -> "ssc-cgl").
 *
 * @param text - Input text
 * @returns Slugified string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters (except hyphens)
    .replace(/--+/g, '-') // Replace multiple consecutive hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 * Generates a standard download filename for processed documents.
 * Format: [exam-short-name]-[doc-type]-[width]x[height].[format]
 * Example: generateFilename("SSC CGL", "photo", 100, 120, "jpg") -> "ssc-cgl-photo-100x120.jpg"
 *
 * @param examShortName - Short name of the exam/organization
 * @param docType - Type of document ('photo', 'signature', 'thumb', etc.)
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param format - Output file extension/format ('jpg', 'png')
 * @returns Standardized filename string
 */
export function generateFilename(
  examShortName: string,
  docType: string,
  width: number,
  height: number,
  format: string
): string {
  const examSlug = slugify(examShortName) || 'form';
  const docSlug = slugify(docType) || 'photo';
  const ext = format.toLowerCase().replace(/^\./, '').replace(/^jpeg$/, 'jpg');
  return `${examSlug}-${docSlug}-${Math.round(width)}x${Math.round(height)}.${ext}`;
}

/**
 * Determines whether a file is in HEIC or HEIF format based on MIME type or file extension.
 *
 * @param file - File object to inspect
 * @returns True if file is HEIC/HEIF, false otherwise
 */
export function isHEIC(file: File): boolean {
  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  return (
    mime === 'image/heic' ||
    mime === 'image/heif' ||
    mime === 'image/heic-sequence' ||
    mime === 'image/heif-sequence' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}

/**
 * Clamps a number between a minimum and maximum boundary.
 *
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Creates a debounced version of a function that delays invoking `fn`
 * until after `ms` milliseconds have elapsed since the last time it was invoked.
 *
 * @param fn - The function to debounce
 * @param ms - Delay in milliseconds
 * @returns Debounced function with an optional cancel() method
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, ms);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as any;
}
