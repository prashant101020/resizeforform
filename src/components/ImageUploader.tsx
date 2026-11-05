'use client';

import React, { useState, useRef, useCallback } from 'react';
import { loadImage } from '@/lib/image-processor';
import { formatFileSize } from '@/lib/utils';

export interface ImageUploaderProps {
  onImageLoaded: (file: File, img: HTMLImageElement) => void;
  disabled?: boolean;
  className?: string;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export function ImageUploader({
  onImageLoaded,
  disabled = false,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);

      // Validate size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `File is too large (${formatFileSize(file.size)}). Maximum supported file size is 20 MB.`
        );
        return;
      }

      // Validate type / extension
      const fileNameLower = file.name.toLowerCase();
      const isAcceptedType =
        ACCEPTED_TYPES.includes(file.type.toLowerCase()) ||
        fileNameLower.endsWith('.jpg') ||
        fileNameLower.endsWith('.jpeg') ||
        fileNameLower.endsWith('.png') ||
        fileNameLower.endsWith('.webp') ||
        fileNameLower.endsWith('.heic') ||
        fileNameLower.endsWith('.heif');

      if (!isAcceptedType) {
        setErrorMessage(
          'Unsupported file format. Please upload a JPG, PNG, WEBP, or HEIC photo.'
        );
        return;
      }

      setIsLoading(true);

      try {
        const img = await loadImage(file);
        setCurrentFile(file);
        setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
        onImageLoaded(file, img);
      } catch (err) {
        console.error('Failed to load image:', err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Could not load or decode the image. Please try another file.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onImageLoaded]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input value so re-selecting same file triggers change
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isLoading) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  const triggerCameraInput = () => {
    if (!disabled && !isLoading) {
      cameraInputRef.current?.click();
    }
  };

  const handleReset = () => {
    setCurrentFile(null);
    setImageMeta(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isLoading}
        aria-label="Upload photo file"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isLoading}
        aria-label="Take photo with camera"
      />

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">Upload failed</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* If file already uploaded, show file info with change button */}
      {currentFile && !isLoading ? (
        <div className="p-4 sm:p-5 rounded-xl border-2 border-green-500/40 bg-green-50/50 dark:bg-green-950/20 dark:border-green-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-green-600/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 flex items-center justify-center shrink-0 text-2xl">
              ✓
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                {currentFile.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {formatFileSize(currentFile.size)}
                {imageMeta ? ` • ${imageMeta.width} × ${imageMeta.height} px` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Choose Another
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Remove uploaded file"
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFileInput();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload photo: drag and drop or press Enter to browse files"
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50/60 dark:bg-gray-800/40'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Reading and optimizing photo...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Decoding directly on your device
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5 shadow-inner">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>

              <div className="space-y-1 mb-3">
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  Drag &amp; drop your photo here, or{' '}
                  <span className="text-blue-600 dark:text-blue-400 underline underline-offset-2">
                    browse
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports JPG, PNG, WEBP, HEIC • Max file size: 20 MB
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
                >
                  Browse Files
                </button>

                <button
                  type="button"
                  onClick={triggerCameraInput}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Take Photo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
