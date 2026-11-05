'use client';

import React, { useId } from 'react';
import type { ProcessingOptions, ImageFormat } from '@/types';

export interface CustomSettingsFormProps {
  settings: ProcessingOptions;
  onChange: (settings: ProcessingOptions) => void;
  className?: string;
}

export function CustomSettingsForm({
  settings,
  onChange,
  className = '',
}: CustomSettingsFormProps) {
  const widthId = useId();
  const heightId = useId();
  const minKbId = useId();
  const maxKbId = useId();
  const formatId = useId();
  const cleanupId = useId();

  const handleNumberChange = (
    field: 'width' | 'height' | 'minKB' | 'maxKB',
    value: string
  ) => {
    const num = parseInt(value, 10);
    onChange({
      ...settings,
      [field]: isNaN(num) ? 0 : Math.max(0, num),
    });
  };

  const handleFormatChange = (format: ImageFormat) => {
    onChange({
      ...settings,
      format,
    });
  };

  const handleCleanupToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      signatureCleanup: e.target.checked,
    });
  };

  // Validation warnings
  const isWidthInvalid = settings.width <= 0;
  const isHeightInvalid = settings.height <= 0;
  const isMinInvalid = settings.minKB < 0;
  const isMaxInvalid = settings.maxKB <= 0 || settings.maxKB <= settings.minKB;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-gray-150 dark:border-gray-700">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <span>⚙️</span> Custom Resize Specifications
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Define precise pixels, file size boundary, and format
          </p>
        </div>

        {/* Quick presets shortcut buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...settings,
                width: 350,
                height: 450,
                minKB: 20,
                maxKB: 50,
                format: 'jpg',
              })
            }
            className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Passport (350×450)
          </button>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...settings,
                width: 140,
                height: 60,
                minKB: 10,
                maxKB: 20,
                format: 'jpg',
                signatureCleanup: true,
              })
            }
            className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Signature (140×60)
          </button>
        </div>
      </div>

      {/* Main input fields grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Width */}
        <div>
          <label
            htmlFor={widthId}
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Width (px) <span className="text-red-500">*</span>
          </label>
          <input
            id={widthId}
            type="number"
            min="10"
            max="10000"
            step="1"
            value={settings.width || ''}
            onChange={(e) => handleNumberChange('width', e.target.value)}
            aria-invalid={isWidthInvalid}
            className={`w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900 border ${
              isWidthInvalid
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
            } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="e.g. 350"
          />
          {isWidthInvalid && (
            <p className="text-[11px] text-red-500 mt-0.5">Width &gt; 0 required</p>
          )}
        </div>

        {/* Height */}
        <div>
          <label
            htmlFor={heightId}
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Height (px) <span className="text-red-500">*</span>
          </label>
          <input
            id={heightId}
            type="number"
            min="10"
            max="10000"
            step="1"
            value={settings.height || ''}
            onChange={(e) => handleNumberChange('height', e.target.value)}
            aria-invalid={isHeightInvalid}
            className={`w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900 border ${
              isHeightInvalid
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
            } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="e.g. 450"
          />
          {isHeightInvalid && (
            <p className="text-[11px] text-red-500 mt-0.5">Height &gt; 0 required</p>
          )}
        </div>

        {/* Min KB */}
        <div>
          <label
            htmlFor={minKbId}
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Min Size (KB)
          </label>
          <input
            id={minKbId}
            type="number"
            min="0"
            max="5000"
            step="1"
            value={settings.minKB}
            onChange={(e) => handleNumberChange('minKB', e.target.value)}
            aria-invalid={isMinInvalid}
            className={`w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900 border ${
              isMinInvalid
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
            } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="e.g. 20"
          />
        </div>

        {/* Max KB */}
        <div>
          <label
            htmlFor={maxKbId}
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Max Size (KB) <span className="text-red-500">*</span>
          </label>
          <input
            id={maxKbId}
            type="number"
            min="1"
            max="10000"
            step="1"
            value={settings.maxKB || ''}
            onChange={(e) => handleNumberChange('maxKB', e.target.value)}
            aria-invalid={isMaxInvalid}
            className={`w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900 border ${
              isMaxInvalid
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'
            } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="e.g. 50"
          />
          {isMaxInvalid && (
            <p className="text-[11px] text-red-500 mt-0.5">
              Must be &gt; min KB ({settings.minKB})
            </p>
          )}
        </div>
      </div>

      {/* Format & Signature Cleanup Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        {/* Format Selector */}
        <div className="flex items-center gap-3">
          <span id={formatId} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Output Format:
          </span>
          <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => handleFormatChange('jpg')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                settings.format === 'jpg'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              JPG (Recommended)
            </button>
            <button
              type="button"
              onClick={() => handleFormatChange('png')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                settings.format === 'png'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              PNG
            </button>
          </div>
        </div>

        {/* Signature Cleanup Checkbox */}
        <div className="flex items-center gap-2">
          <input
            id={cleanupId}
            type="checkbox"
            checked={!!settings.signatureCleanup}
            onChange={handleCleanupToggle}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-offset-gray-800 border-gray-300 dark:border-gray-700 cursor-pointer"
          />
          <label
            htmlFor={cleanupId}
            className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer"
          >
            Signature cleanup{' '}
            <span className="text-gray-400 dark:text-gray-500">
              (auto-contrast, pure white background)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default CustomSettingsForm;
