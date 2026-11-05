'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badge */}
        <div className="mb-8 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Your photos never leave your device
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                100% client-side processing using your browser. No files are uploaded or stored on any server.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center text-xs font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 shadow-sm shrink-0">
            🛡️ Zero-Upload Privacy
          </span>
        </div>

        {/* Links and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/exams"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              All Exams
            </Link>
            <Link
              href="/compress-pdf"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Compress PDF
            </Link>
            <Link
              href="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <a
              href="mailto:contact@resizeforform.com"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="text-xs text-center md:text-right text-gray-500 dark:text-gray-400">
            <p>&copy; {currentYear} ResizeForForm. Free utility for Indian exam applicants.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
