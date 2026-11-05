/**
 * Signature processing and enhancement utility for ResizeForForm.
 * Cleans scanned or photographed signatures by whitening the background,
 * boosting contrast, and darkening ink strokes.
 */

/**
 * Cleans up a signature image drawn on a canvas.
 * - Applies auto-contrast by analyzing pixel luminance distribution
 * - Forces the background paper to pure white (#ffffff)
 * - Darkens and enriches ink strokes while maintaining smoothness
 * - Ensures full opacity for clean rendering
 *
 * @param canvas - HTMLCanvasElement containing the raw signature
 * @returns A new HTMLCanvasElement containing the cleaned signature
 */
export function cleanupSignature(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const width = canvas.width;
  const height = canvas.height;

  // Create an output canvas of identical dimensions
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;

  const ctx = outputCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || width === 0 || height === 0) {
    return canvas;
  }

  // Draw input canvas onto the new canvas
  ctx.drawImage(canvas, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  // 1. Compute 256-bin luminance histogram
  // Standard Rec. 601 luminance coefficients: 0.299 R + 0.587 G + 0.114 B
  const histogram = new Uint32Array(256);

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    // If pixel is semi-transparent, treat as white paper
    if (a < 64) {
      histogram[255]++;
      continue;
    }
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    histogram[lum]++;
  }

  // 2. Find darkest (1st percentile) and lightest (98th percentile) pixel levels
  let pLow = 0;
  let pHigh = 255;
  let count = 0;

  const lowCutoff = Math.max(1, Math.floor(totalPixels * 0.01));
  const highCutoff = Math.floor(totalPixels * 0.98);

  for (let i = 0; i < 256; i++) {
    count += histogram[i];
    if (pLow === 0 && count >= lowCutoff) {
      pLow = i;
    }
    if (count >= highCutoff) {
      pHigh = i;
      break;
    }
  }

  // Ensure minimum luminance spread to prevent division by zero or extreme stretching
  if (pHigh - pLow < 20) {
    pLow = Math.max(0, pLow - 10);
    pHigh = Math.min(255, pHigh + 20);
  }

  // 3. Determine threshold for white background
  // Pixels above this threshold are forced to pure white (#FFFFFF)
  const range = pHigh - pLow;
  let whiteThreshold = pLow + range * 0.72;
  // Clamp white threshold to reasonable paper bounds (170-235)
  whiteThreshold = Math.max(170, Math.min(whiteThreshold, 235));

  const inkRange = Math.max(1, whiteThreshold - pLow);

  // 4. Process pixels: whiten background and darken ink
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 64) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
      continue;
    }

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum >= whiteThreshold) {
      // Force background to pure white
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    } else {
      // Ink stroke: apply non-linear contrast curve to make ink deep and rich
      // Normalized position in ink range [0..1]
      const normalized = Math.max(0, (lum - pLow) / inkRange);
      // Exponential curve darkens midtones while keeping anti-aliasing edges smooth
      const factor = Math.pow(normalized, 1.4);
      const targetLum = factor * 255;
      const scale = targetLum / Math.max(lum, 1);

      data[i] = Math.min(255, Math.round(r * scale));
      data[i + 1] = Math.min(255, Math.round(g * scale));
      data[i + 2] = Math.min(255, Math.round(b * scale));
      data[i + 3] = 255; // Ensure ink is fully opaque
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return outputCanvas;
}
