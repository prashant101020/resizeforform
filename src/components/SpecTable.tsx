import React from 'react';
import type { Preset } from '@/types';

export interface SpecTableProps {
  preset: Preset;
  className?: string;
}

function formatDate(dateStr: string): string {
  try {
    const [year, month] = dateStr.split('-');
    if (year && month) {
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${monthNames[mIdx] || month} ${year}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export function SpecTable({ preset, className = '' }: SpecTableProps) {
  const formattedDate = formatDate(preset.lastVerified);

  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 sm:p-6 shadow-sm space-y-5 ${className}`}
    >
      {/* Header with Title and Verification badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-150 dark:border-gray-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {preset.examName} {preset.documentType.toUpperCase()} Specifications
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Conducted by {preset.organization}
          </p>
        </div>

        {preset.verified ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0 self-start sm:self-center">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified Spec
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0 self-start sm:self-center">
            ⚠️ Verification Pending
          </span>
        )}
      </div>

      {/* Warning if unverified */}
      {!preset.verified && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-2.5">
          <span className="text-base shrink-0 mt-0.5">⚠️</span>
          <div>
            <strong>Notice:</strong> These specs may have changed in recent notifications.
            Please verify requirements from the official source link below before submitting.
          </div>
        </div>
      )}

      {/* Specifications Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
            <tr className="bg-gray-50/50 dark:bg-gray-900/30">
              <th scope="row" className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 w-1/3 text-xs uppercase tracking-wider">
                Document Type
              </th>
              <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white capitalize">
                {preset.documentType === 'photo' && '📷 Passport Photograph'}
                {preset.documentType === 'signature' && '✍️ Official Signature'}
                {preset.documentType === 'thumb' && '👆 Thumb Impression'}
              </td>
            </tr>

            <tr>
              <th scope="row" className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Dimensions
              </th>
              <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {preset.width} × {preset.height} pixels
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                  (Aspect ratio {(preset.width / preset.height).toFixed(2)}:1)
                </span>
              </td>
            </tr>

            <tr className="bg-gray-50/50 dark:bg-gray-900/30">
              <th scope="row" className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Allowed File Size
              </th>
              <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                {preset.minKB} KB – {preset.maxKB} KB
              </td>
            </tr>

            <tr>
              <th scope="row" className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Accepted Format
              </th>
              <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white uppercase">
                {preset.format} / JPEG
              </td>
            </tr>

            <tr className="bg-gray-50/50 dark:bg-gray-900/30">
              <th scope="row" className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Conducting Authority
              </th>
              <td className="py-3 px-4 text-gray-900 dark:text-white">
                {preset.organization}
              </td>
            </tr>

            {preset.notes && (
              <tr>
                <th scope="row" className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider align-top">
                  Official Guidelines
                </th>
                <td className="py-3 px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {preset.notes}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Verification footer & link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Last verified: {formattedDate}</span>
        {preset.sourceUrl && (
          <a
            href={preset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Official Website Notification
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default SpecTable;
