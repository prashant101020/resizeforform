'use client';

import React from 'react';
import type { Preset, ProcessingResult } from '@/types';
import { formatFileSize } from '@/lib/utils';

export interface ResultPreviewProps {
  originalFile: File;
  result: ProcessingResult;
  preset?: Preset;
  onReset: () => void;
  className?: string;
}

export function ResultPreview({
  originalFile,
  result,
  preset,
  onReset,
  className = '',
}: ResultPreviewProps) {
  const minLimit = preset ? preset.minKB : 0;
  const maxLimit = preset ? preset.maxKB : Infinity;
  const isWithinLimit = result.sizeKB >= minLimit && (preset ? result.sizeKB <= maxLimit : true);

  const handleDownload = () => {
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const originalSizeText = formatFileSize(originalFile.size);
  const processedSizeText = `${result.sizeKB.toFixed(1)} KB`;

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start sm:items-center gap-3.5 ${
          isWithinLimit
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl font-bold ${
            isWithinLimit
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white'
          }`}
        >
          {isWithinLimit ? '✓' : '!'}
        </div>
        <div className="flex-1">
          <p className="font-bold text-base">
            {isWithinLimit
              ? 'Ready to upload! Specifications matched perfectly.'
              : 'File resized with warning'}
          </p>
          <p className="text-xs sm:text-sm opacity-90">
            {preset ? (
              <>
                File size: <strong>{processedSizeText}</strong> (Target range:{' '}
                {preset.minKB}–{preset.maxKB} KB)
              </>
            ) : (
              <>
                File size: <strong>{processedSizeText}</strong> • Dimensions:{' '}
                {result.width} × {result.height} px
              </>
            )}
          </p>
        </div>
      </div>

      {/* Image Preview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative max-h-80 max-w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.dataUrl}
              alt="Processed output preview"
              className="max-h-72 object-contain mx-auto rounded shadow"
              style={{
                width: result.width > 300 ? 'auto' : undefined,
              }}
            />
            <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur text-white font-mono text-[11px] px-2 py-0.5 rounded shadow">
              {result.width} × {result.height} px
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-full">
            {result.filename}
          </p>
        </div>

        {/* Before / After Comparison Table */}
        <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
          {/* Before */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750/50 border border-gray-100 dark:border-gray-700">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              Original
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={originalFile.name}>
                {originalFile.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Size: <span className="font-medium text-gray-900 dark:text-gray-100">{originalSizeText}</span>
              </p>
            </div>
          </div>

          {/* After */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Processed
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">
                {result.width} × {result.height} px
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Size:{' '}
                <span className="font-bold text-base text-blue-600 dark:text-blue-400">
                  {processedSizeText}
                </span>{' '}
                {result.quality !== null && (
                  <span className="text-[11px] opacity-75">
                    ({Math.round(result.quality * 100)}% q)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 min-h-[52px] px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <span>Download Resized Photo</span>
          <span className="text-xs font-normal opacity-90 px-2 py-0.5 rounded-full bg-blue-700/80">
            {processedSizeText}
          </span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          Process Another
        </button>
      </div>
    </div>
  );
}

export default ResultPreview;
