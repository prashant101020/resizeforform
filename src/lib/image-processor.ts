/**
 * Core image processing engine for ResizeForForm.
 * Handles client-side loading, format conversion (including HEIC), cropping,
 * high-quality multi-step downscaling, binary search JPEG quality optimization,
 * and signature cleanup.
 */

import {
  ProcessingOptions,
  ProcessingResult,
  ProcessingError,
  CropArea,
} from '@/types';
import { generateFilename, isHEIC } from '@/lib/utils';
import { cleanupSignature } from '@/lib/signature-processor';

/** Maximum allowed input image size: 20 MB */
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

/**
 * Type guard to check if a processing outcome is an error.
 *
 * @param result - ProcessingResult or ProcessingError
 * @returns True if result is ProcessingError
 */
export function isProcessingError(
  result: ProcessingResult | ProcessingError
): result is ProcessingError {
  return 'type' in result && 'suggestion' in result;
}

/**
 * Loads an image file into an HTMLImageElement.
 * - Detects HEIC/HEIF files and dynamically converts them to JPEG via `heic2any`
 * - Handles EXIF orientation: Modern browsers (Chrome 81+, Safari 13.1+, Firefox 78+)
 *   automatically honor EXIF orientation tags during image decoding and canvas drawing.
 * - Validates file size to prevent browser crashes on excessively large files (>20 MB).
 *
 * @param file - The input image File
 * @returns Loaded HTMLImageElement
 * @throws Error if file exceeds size limit or fails to decode
 */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum limit of 20 MB. Please upload a smaller image.`
    );
  }

  let imageBlob: Blob = file;

  // Convert HEIC / HEIF to JPEG if necessary
  if (isHEIC(file)) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92,
      });
      imageBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch {
      throw new Error(
        'Failed to convert HEIC/HEIF image. Please convert your photo to JPG or PNG and try again.'
      );
    }
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(imageBlob);
    const img = new Image();

    // EXIF orientation note: Modern browsers handle EXIF orientation natively for <img> elements.
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        reject(new Error('Invalid image dimensions.'));
      } else {
        resolve(img);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          'Failed to load image. The file may be corrupt or an unsupported format.'
        )
      );
    };

    img.src = objectUrl;
  });
}

/**
 * Crops a sub-region of an image and scales it to targetWidth x targetHeight.
 * Uses high-quality multi-step downscaling (halving step down) when the source
 * crop is more than 2x larger than the target, preventing aliasing and blurriness.
 * Pre-fills background with white (#ffffff) to prevent black backgrounds in JPEG exports.
 *
 * @param img - Source HTMLImageElement
 * @param cropArea - Bounding box of the crop { x, y, width, height }
 * @param targetWidth - Final desired width in pixels
 * @param targetHeight - Final desired height in pixels
 * @returns HTMLCanvasElement containing the cropped and scaled image
 */
export function getCroppedImg(
  img: HTMLImageElement,
  cropArea: CropArea,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  // Safely clamp crop area within image boundaries
  const cX = Math.max(0, Math.min(Math.round(cropArea.x), naturalW));
  const cY = Math.max(0, Math.min(Math.round(cropArea.y), naturalH));
  const cWidth = Math.max(1, Math.min(Math.round(cropArea.width), naturalW - cX));
  const cHeight = Math.max(1, Math.min(Math.round(cropArea.height), naturalH - cY));

  const tWidth = Math.max(1, Math.round(targetWidth));
  const tHeight = Math.max(1, Math.round(targetHeight));

  // Step 1: Draw the cropped region to an initial intermediate canvas
  let currentCanvas = document.createElement('canvas');
  currentCanvas.width = cWidth;
  currentCanvas.height = cHeight;

  const currentCtx = currentCanvas.getContext('2d');
  if (!currentCtx) {
    throw new Error('Failed to create 2D canvas context');
  }

  // Pre-fill white background to avoid transparent black areas in JPEG
  currentCtx.fillStyle = '#ffffff';
  currentCtx.fillRect(0, 0, cWidth, cHeight);
  currentCtx.imageSmoothingEnabled = true;
  currentCtx.imageSmoothingQuality = 'high';

  currentCtx.drawImage(img, cX, cY, cWidth, cHeight, 0, 0, cWidth, cHeight);

  // Step 2: Multi-step downscaling if source crop is more than 2x larger than target
  let curW = cWidth;
  let curH = cHeight;

  while (curW / 2 >= tWidth && curH / 2 >= tHeight) {
    const nextW = Math.floor(curW / 2);
    const nextH = Math.floor(curH / 2);

    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = nextW;
    stepCanvas.height = nextH;

    const stepCtx = stepCanvas.getContext('2d');
    if (!stepCtx) break;

    stepCtx.fillStyle = '#ffffff';
    stepCtx.fillRect(0, 0, nextW, nextH);
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';
    stepCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);

    currentCanvas = stepCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Step 3: Final scaling onto target canvas
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = tWidth;
  finalCanvas.height = tHeight;

  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) {
    throw new Error('Failed to create 2D canvas context');
  }

  finalCtx.fillStyle = '#ffffff';
  finalCtx.fillRect(0, 0, tWidth, tHeight);
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.drawImage(
    currentCanvas,
    0,
    0,
    currentCanvas.width,
    currentCanvas.height,
    0,
    0,
    tWidth,
    tHeight
  );

  return finalCanvas;
}

/**
 * Promisified wrapper around HTMLCanvasElement.toBlob.
 *
 * @param canvas - Source HTMLCanvasElement
 * @param format - MIME type ('image/jpeg' | 'image/png')
 * @param quality - Optional JPEG quality parameter (0.0 to 1.0)
 * @returns Promise resolving to the resulting Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png',
  quality?: number
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Converts a Blob to a Base64 data URL for instant image preview.
 *
 * @param blob - Image Blob
 * @returns Base64 data URL string
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert Blob to data URL'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Core image processing pipeline:
 * 1. Crops region (if specified) or uses the full image.
 * 2. Multi-step downscales to exact width × height.
 * 3. Applies signature contrast enhancement and white backgrounding if requested.
 * 4. Compresses to meet exact minKB and maxKB constraints:
 *    - For JPG: Binary searches quality (0.10 to 0.95) with 0.01 precision.
 *    - For PNG: Generates lossless image and validates size constraints.
 * 5. Returns ProcessingResult with blob, dataUrl, exact size, and suggested filename.
 *
 * @param img - Loaded HTMLImageElement
 * @param options - Processing options (dimensions, size constraints, format, crop, etc.)
 * @returns ProcessingResult on success or ProcessingError on constraint violation
 */
export async function processImage(
  img: HTMLImageElement,
  options: ProcessingOptions
): Promise<ProcessingResult | ProcessingError> {
  try {
    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;

    // Use provided crop area or default to entire image
    const cropArea: CropArea = options.cropArea ?? {
      x: 0,
      y: 0,
      width: naturalW,
      height: naturalH,
    };

    // Crop and scale to target dimensions
    let canvas = getCroppedImg(img, cropArea, options.width, options.height);

    // Apply signature cleanup if requested
    if (options.signatureCleanup) {
      canvas = cleanupSignature(canvas);
    }

    let finalBlob: Blob;
    let finalQuality: number | null = null;

    if (options.format === 'jpg') {
      const mimeType = 'image/jpeg';
      const minKB = options.minKB || 0;
      const maxKB = options.maxKB;

      // 1. Test highest quality (0.95)
      const highBlob = await canvasToBlob(canvas, mimeType, 0.95);
      const highKB = highBlob.size / 1024;

      if (highKB <= maxKB) {
        if (minKB > 0 && highKB < minKB) {
          return {
            type: 'too-small',
            message: `Resulting file size (${highKB.toFixed(1)} KB) is below the required minimum of ${minKB} KB even at high quality (0.95).`,
            suggestion:
              'Try uploading a photo with higher resolution, less blank space, or adjust the crop area.',
          };
        }
        finalBlob = highBlob;
        finalQuality = 0.95;
      } else {
        // 2. Test minimum acceptable quality (0.10)
        const lowBlob = await canvasToBlob(canvas, mimeType, 0.1);
        const lowKB = lowBlob.size / 1024;

        if (lowKB > maxKB) {
          return {
            type: 'too-large',
            message: `Image cannot be compressed below ${maxKB} KB (smallest size achieved was ${lowKB.toFixed(1)} KB at minimum quality 0.10).`,
            suggestion:
              'Try cropping tighter around the subject or reducing unnecessary background detail.',
          };
        }

        // 3. Binary search for optimal quality between 0.10 and 0.95 (precision to 0.01)
        let low = 0.1;
        let high = 0.95;
        let bestBlob = lowBlob;
        let bestQuality = 0.1;

        while (high - low >= 0.01) {
          const mid = Math.round(((low + high) / 2) * 100) / 100;
          const midBlob = await canvasToBlob(canvas, mimeType, mid);
          const midKB = midBlob.size / 1024;

          if (midKB <= maxKB) {
            bestBlob = midBlob;
            bestQuality = mid;
            low = mid + 0.01; // Try for better quality
          } else {
            high = mid - 0.01; // Exceeded max size, reduce quality
          }
        }

        const finalKB = bestBlob.size / 1024;
        if (minKB > 0 && finalKB < minKB) {
          return {
            type: 'too-small',
            message: `Resulting file size (${finalKB.toFixed(1)} KB) is below the required minimum of ${minKB} KB.`,
            suggestion:
              'Try adjusting the crop area or uploading an image with more detail.',
          };
        }

        finalBlob = bestBlob;
        finalQuality = bestQuality;
      }
    } else {
      // PNG format (lossless)
      const pngBlob = await canvasToBlob(canvas, 'image/png');
      const pngKB = pngBlob.size / 1024;

      if (pngKB > options.maxKB) {
        return {
          type: 'too-large',
          message: `PNG image size (${pngKB.toFixed(1)} KB) exceeds the maximum limit of ${options.maxKB} KB.`,
          suggestion:
            'PNG uses lossless compression and cannot be reduced in size. Try switching the output format to JPG.',
        };
      }

      if (options.minKB > 0 && pngKB < options.minKB) {
        return {
          type: 'too-small',
          message: `PNG image size (${pngKB.toFixed(1)} KB) is below the minimum required ${options.minKB} KB.`,
          suggestion:
            'Try uploading a higher-resolution image or adjusting the crop area.',
        };
      }

      finalBlob = pngBlob;
      finalQuality = null;
    }

    const dataUrl = await blobToDataURL(finalBlob);
    const filename = options.filename
      ? options.filename
      : generateFilename(
          options.examShortName || 'form',
          options.documentType || 'photo',
          options.width,
          options.height,
          options.format
        );

    const sizeBytes = finalBlob.size;
    const sizeKB = Math.round((sizeBytes / 1024) * 10) / 10;

    return {
      blob: finalBlob,
      dataUrl,
      width: options.width,
      height: options.height,
      sizeBytes,
      sizeKB,
      quality: finalQuality,
      filename,
    };
  } catch (error) {
    return {
      type: 'generic',
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during image processing.',
      suggestion: 'Please try again or try uploading a different image file.',
    };
  }
}
