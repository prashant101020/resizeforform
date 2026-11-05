/**
 * Client-side PDF compression utility for ResizeForForm.
 * Compresses PDF files by re-encoding embedded JPEG images at reduced quality
 * and stripping non-essential metadata.
 */

import { PDFDocument, PDFName, PDFNumber } from 'pdf-lib';

/**
 * Re-encodes raw JPEG byte array at a specified quality level using HTML5 Canvas.
 *
 * @param jpegBytes - Uint8Array containing raw JPEG file data
 * @param quality - Output JPEG quality (0.0 to 1.0)
 * @returns Re-encoded JPEG bytes, or null if re-encoding fails
 */
async function recompressJpeg(
  jpegBytes: Uint8Array,
  quality: number
): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    try {
      const blob = new Blob([jpegBytes as unknown as BlobPart], { type: 'image/jpeg' });
      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        try {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;

          if (width === 0 || height === 0) {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
            return;
          }

          // Pre-fill white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            async (compressedBlob) => {
              URL.revokeObjectURL(objectUrl);
              if (compressedBlob) {
                const buffer = await compressedBlob.arrayBuffer();
                resolve(new Uint8Array(buffer));
              } else {
                resolve(null);
              }
            },
            'image/jpeg',
            quality
          );
        } catch {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };

      img.src = objectUrl;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Strips metadata from a PDFDocument to reduce unnecessary byte overhead.
 *
 * @param pdfDoc - Loaded PDFDocument instance
 */
function stripPdfMetadata(pdfDoc: PDFDocument): void {
  try {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    // Attempt to remove XML metadata stream if present
    if (pdfDoc.catalog && typeof pdfDoc.catalog.delete === 'function') {
      pdfDoc.catalog.delete(PDFName.of('Metadata'));
    }
  } catch {
    // Non-critical: continue even if metadata stripping fails on certain PDFs
  }
}

/**
 * Compresses a PDF file to meet a maximum target file size (in KB).
 *
 * Strategy:
 * 1. Checks if the PDF is already within the target size.
 * 2. Scans the PDF object tree for embedded JPEG image streams.
 * 3. Re-encodes embedded images at decreasing quality levels (0.70, 0.45, 0.25).
 * 4. Strips document metadata.
 * 5. Returns the compressed Blob and size if within target, or a clear error with suggestions.
 *
 * @param file - Original PDF File uploaded by the user
 * @param targetKB - Maximum desired size in Kilobytes
 * @returns An object containing the compressed blob and size, or an error description
 */
export async function compressPdf(
  file: File,
  targetKB: number
): Promise<{ blob: Blob; sizeKB: number } | { error: string }> {
  const originalSizeKB = file.size / 1024;

  // If already under or equal to target size, return original file
  if (originalSizeKB <= targetKB) {
    return {
      blob: file,
      sizeKB: Math.round(originalSizeKB * 10) / 10,
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    // Qualities to attempt in order
    const qualityLevels = [0.7, 0.45, 0.25];
    let bestBlob: Blob | null = null;
    let bestSizeKB = originalSizeKB;

    for (const quality of qualityLevels) {
      // Reload a fresh copy of the document for each compression pass
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      stripPdfMetadata(pdfDoc);

      const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
      let reencodedAny = false;

      for (const [, obj] of indirectObjects) {
        const streamObj = obj as any;
        const dict = streamObj?.dict;

        if (!dict || typeof dict.get !== 'function' || !streamObj.contents) {
          continue;
        }

        const subtype = dict.get(PDFName.of('Subtype'));
        const filter = dict.get(PDFName.of('Filter'));

        const isImage = subtype?.toString() === '/Image';
        const isJpeg =
          filter?.toString() === '/DCTDecode' ||
          (Array.isArray(filter?.asArray?.()) &&
            filter.asArray().some((f: any) => f?.toString() === '/DCTDecode'));

        if (isImage && isJpeg && streamObj.contents instanceof Uint8Array) {
          const rawBytes = streamObj.contents;
          const reencoded = await recompressJpeg(rawBytes, quality);

          if (reencoded && reencoded.length < rawBytes.length) {
            streamObj.contents = reencoded;
            dict.set(PDFName.of('Length'), PDFNumber.of(reencoded.length));
            reencodedAny = true;
          }
        }
      }

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const currentBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const currentSizeKB = currentBlob.size / 1024;

      if (currentSizeKB < bestSizeKB) {
        bestSizeKB = currentSizeKB;
        bestBlob = currentBlob;
      }

      // If we met the target, return immediately
      if (currentSizeKB <= targetKB) {
        return {
          blob: currentBlob,
          sizeKB: Math.round(currentSizeKB * 10) / 10,
        };
      }

      // If no images were re-encoded, subsequent quality passes won't help
      if (!reencodedAny) {
        break;
      }
    }

    // Check if any reduction was achieved
    if (bestBlob && bestSizeKB <= targetKB) {
      return {
        blob: bestBlob,
        sizeKB: Math.round(bestSizeKB * 10) / 10,
      };
    }

    const achievedKBText = bestBlob
      ? `(compressed to ${Math.round(bestSizeKB * 10) / 10} KB from ${Math.round(originalSizeKB * 10) / 10} KB)`
      : `(current size is ${Math.round(originalSizeKB * 10) / 10} KB)`;

    return {
      error: `Cannot compress this PDF below ${targetKB} KB ${achievedKBText}. The document may contain complex text vectors, embedded fonts, or non-JPEG images. For heavy documents, please scan at 150 DPI or use a desktop PDF compressor.`,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? `PDF compression failed: ${error.message}`
          : 'Failed to process PDF. The file may be password protected or corrupted.',
    };
  }
}
