'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Preset,
  ProcessingOptions,
  CropArea,
  ProcessingResult,
  ProcessingError,
} from '@/types';
import { processImage, isProcessingError } from '@/lib/image-processor';
import { PresetSelector } from './PresetSelector';
import { CustomSettingsForm } from './CustomSettingsForm';
import { ImageUploader } from './ImageUploader';
import { ImageCropper } from './ImageCropper';
import { ResultPreview } from './ResultPreview';

export interface ResizeToolProps {
  initialPreset?: Preset;
  className?: string;
}

type Stage = 'select' | 'upload' | 'crop' | 'processing' | 'result' | 'error';

const DEFAULT_CUSTOM_SETTINGS: ProcessingOptions = {
  width: 350,
  height: 450,
  minKB: 20,
  maxKB: 50,
  format: 'jpg',
  signatureCleanup: false,
};

export function ResizeTool({ initialPreset, className = '' }: ResizeToolProps) {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(
    initialPreset ?? null
  );
  const [customSettings, setCustomSettings] = useState<ProcessingOptions>(
    DEFAULT_CUSTOM_SETTINGS
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isCropEnabled, setIsCropEnabled] = useState<boolean>(true);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [stage, setStage] = useState<Stage>(initialPreset ? 'upload' : 'select');
  const [processingProgress, setProcessingProgress] = useState<string>('Resizing...');

  // Update preset if initialPreset prop changes
  useEffect(() => {
    if (initialPreset) {
      setSelectedPreset(initialPreset);
    }
  }, [initialPreset]);

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Current active dimensions
  const activeWidth = selectedPreset ? selectedPreset.width : customSettings.width;
  const activeHeight = selectedPreset ? selectedPreset.height : customSettings.height;
  const activeMinKB = selectedPreset ? selectedPreset.minKB : customSettings.minKB;
  const activeMaxKB = selectedPreset ? selectedPreset.maxKB : customSettings.maxKB;
  const activeFormat = selectedPreset ? selectedPreset.format : customSettings.format;

  // Aspect ratio for cropper
  const aspectRatio = useMemo(() => {
    if (activeWidth > 0 && activeHeight > 0) {
      return activeWidth / activeHeight;
    }
    return 1;
  }, [activeWidth, activeHeight]);

  // Handle Preset Selection
  const handlePresetSelect = (preset: Preset | null) => {
    setSelectedPreset(preset);
    setError(null);
    if (!uploadedFile) {
      setStage('upload');
    }
  };

  // Handle Image Loaded from Uploader
  const handleImageLoaded = useCallback((file: File, img: HTMLImageElement) => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    setUploadedImage(img);
    setImageUrl(url);
    setResult(null);
    setError(null);
    setStage('crop');
  }, [imageUrl]);

  // Handle Cropping area change
  const handleCropComplete = useCallback((area: CropArea) => {
    setCropArea(area);
  }, []);

  // Run the resizing process
  const handleProcess = async () => {
    if (!uploadedImage || !uploadedFile) return;

    setStage('processing');
    setError(null);
    setProcessingProgress('Resizing and optimizing image bytes...');

    const options: ProcessingOptions & {
      examShortName?: string;
      documentType?: string;
    } = selectedPreset
      ? {
          width: selectedPreset.width,
          height: selectedPreset.height,
          minKB: selectedPreset.minKB,
          maxKB: selectedPreset.maxKB,
          format: selectedPreset.format,
          cropArea: isCropEnabled && cropArea ? cropArea : undefined,
          signatureCleanup: selectedPreset.documentType === 'signature',
          examShortName: selectedPreset.examShortName,
          documentType: selectedPreset.documentType,
        }
      : {
          width: customSettings.width,
          height: customSettings.height,
          minKB: customSettings.minKB,
          maxKB: customSettings.maxKB,
          format: customSettings.format,
          cropArea: isCropEnabled && cropArea ? cropArea : undefined,
          signatureCleanup: customSettings.signatureCleanup,
          examShortName: 'custom',
          documentType: 'image',
        };

    try {
      // Small tick to ensure UI paints processing spinner
      await new Promise((r) => setTimeout(r, 60));
      const res = await processImage(uploadedImage, options);

      if (isProcessingError(res)) {
        setError(res);
        setStage('error');
      } else {
        setResult(res);
        setStage('result');
      }
    } catch (err: unknown) {
      console.error('Resize error:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to resize and compress image.';
      
      let type: ProcessingError['type'] = 'generic';
      let suggestion = 'Try adjusting the min/max file size limits or use a clearer photo.';

      if (message.toLowerCase().includes('exceed') || message.toLowerCase().includes('large')) {
        type = 'too-large';
        suggestion = 'Increase the Max KB limit, or crop the image closer to reduce detail.';
      } else if (message.toLowerCase().includes('small') || message.toLowerCase().includes('below')) {
        type = 'too-small';
        suggestion = 'Lower the Min KB limit or upload a higher-resolution photo.';
      }

      setError({
        type,
        message,
        suggestion,
      });
      setStage('error');
    }
  };

  // Reset entire tool
  const handleReset = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    setUploadedFile(null);
    setUploadedImage(null);
    setImageUrl(null);
    setCropArea(null);
    setResult(null);
    setError(null);
    setStage(selectedPreset ? 'upload' : 'select');
  };

  return (
    <div
      className={`w-full bg-white dark:bg-gray-850 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden transition-all ${className}`}
    >
      {/* Privacy Guarantee Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="text-base">🔒</span>
          <span>
            Your photo never leaves your phone or computer — 100% processed in your browser
          </span>
        </div>
        <span className="hidden md:inline-block bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-semibold">
          Client-Side Only
        </span>
      </div>

      <div className="p-4 sm:p-8 space-y-6">
        {/* Step 1: Preset Selection */}
        <div>
          <PresetSelector
            selectedPreset={selectedPreset}
            onSelect={handlePresetSelect}
            initialPresetId={initialPreset?.id}
          />
        </div>

        {/* Step 1b: If Custom, show custom settings form */}
        {selectedPreset === null && (
          <CustomSettingsForm
            settings={customSettings}
            onChange={setCustomSettings}
          />
        )}

        {/* Active specs summary strip */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Target Specs:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {activeWidth} × {activeHeight} px
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {activeMinKB}–{activeMaxKB} KB
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase">
              {activeFormat}
            </span>
          </div>

          {selectedPreset && (
            <span className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {selectedPreset.organization}
            </span>
          )}
        </div>

        {/* Step 2: Upload Zone (shown if no image or in upload stage) */}
        {!uploadedFile && (
          <div className="pt-2">
            <ImageUploader onImageLoaded={handleImageLoaded} />
          </div>
        )}

        {/* Step 3: Cropper & Preview (when image is loaded and not showing final result) */}
        {uploadedFile && imageUrl && stage !== 'result' && (
          <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Crop &amp; Position Your Photo
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fixed aspect ratio {activeWidth}:{activeHeight} to fit exact form criteria
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCropEnabled((prev) => !prev)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    isCropEnabled
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {isCropEnabled ? '✓ Cropping Enabled' : 'Skip Crop (Fit Center)'}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {isCropEnabled ? (
              <ImageCropper
                image={imageUrl}
                aspectRatio={aspectRatio}
                onCropComplete={handleCropComplete}
              />
            ) : (
              <div className="p-6 text-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Full image will be auto-centered and resized to {activeWidth} × {activeHeight} px.
                </p>
              </div>
            )}

            {/* Resize CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProcess}
                disabled={stage === 'processing'}
                className="w-full min-h-[54px] px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
              >
                {stage === 'processing' ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{processingProgress}</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Resize &amp; Compress Now</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">
                      Target: {activeMinKB}–{activeMaxKB} KB
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {stage === 'error' && error && (
          <div
            role="alert"
            className="p-4 sm:p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 space-y-3"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  Optimization Problem: {error.message}
                </h4>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1">
                  <strong>Suggestion:</strong> {error.suggestion}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleProcess}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setStage('crop')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-red-300 dark:border-red-800 hover:bg-gray-50 transition-colors"
              >
                Adjust Crop
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result Preview & Download */}
        {stage === 'result' && result && uploadedFile && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <ResultPreview
              originalFile={uploadedFile}
              result={result}
              preset={selectedPreset ?? undefined}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ResizeTool;
