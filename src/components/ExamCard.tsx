import React from 'react';
import Link from 'next/link';
import type { Preset } from '@/types';

export interface ExamCardProps {
  preset: Preset;
  className?: string;
}

function getDocumentMeta(type: string) {
  switch (type) {
    case 'signature':
      return {
        icon: '✍️',
        label: 'Signature',
        badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      };
    case 'thumb':
      return {
        icon: '👆',
        label: 'Thumb',
        badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      };
    case 'photo':
    default:
      return {
        icon: '📷',
        label: 'Photo',
        badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      };
  }
}

export function ExamCard({ preset, className = '' }: ExamCardProps) {
  const meta = getDocumentMeta(preset.documentType);

  return (
    <Link
      href={`/${preset.slug}`}
      className={`group block p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl shrink-0" aria-hidden="true">
            {meta.icon}
          </span>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {preset.examShortName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-[220px]">
              {preset.organization}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.badgeClass} shrink-0`}
        >
          {meta.label}
        </span>
      </div>

      {/* Specs Row */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {preset.width} × {preset.height} px
          </span>
          <span className="text-gray-400 dark:text-gray-500 mx-1.5">•</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {preset.minKB}–{preset.maxKB} KB
          </span>
        </div>

        <span className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          Resize &rarr;
        </span>
      </div>
    </Link>
  );
}

export default ExamCard;
