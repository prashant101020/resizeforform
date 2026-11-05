'use client';

import React from 'react';

export interface AdSlotProps {
  className?: string;
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
}

/**
 * AdSlot Component
 *
 * Placeholder for Google AdSense or alternative ad network slots.
 *
 * TO INTEGRATE ADSENSE:
 * 1. Ensure the AdSense script tag is loaded in root layout:
 *    <Script
 *      async
 *      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *      crossOrigin="anonymous"
 *      strategy="afterInteractive"
 *    />
 * 2. Replace the placeholder below with:
 *    <ins
 *      className="adsbygoogle"
 *      style={{ display: 'block' }}
 *      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *      data-ad-slot={slotId || "XXXXXXXXXX"}
 *      data-ad-format={format}
 *      data-full-width-responsive="true"
 *    />
 *    <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
 */
export function AdSlot({
  className = '',
  slotId = 'placeholder-ad-slot',
  format = 'auto',
}: AdSlotProps) {
  const isDev = process.env.NODE_ENV !== 'production';

  // In production without an active ad provider, return minimal container or empty element
  return (
    <div
      className={`ad-slot my-4 w-full transition-colors ${
        isDev
          ? 'bg-gray-50/50 dark:bg-gray-900/20 border-dashed border-gray-300 dark:border-gray-700'
          : 'hidden'
      } ${className}`}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
      aria-hidden="true"
    >
      {isDev && (
        <span className="text-gray-400 dark:text-gray-600 text-xs font-mono select-none">
          [Ad Placement: {slotId}]
        </span>
      )}
    </div>
  );
}

export default AdSlot;
