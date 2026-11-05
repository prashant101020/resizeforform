import { Metadata } from 'next';
import Link from 'next/link';
import { presets } from '@/data/presets';
import { ResizeTool } from '@/components/ResizeTool';
import { ExamCard } from '@/components/ExamCard';
import { FAQBlock } from '@/components/FAQBlock';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'ResizeForForm — Resize Photos & Signatures for Government Forms',
  description:
    'Resize photos, signatures, and thumb impressions to exact pixel dimensions and KB limits for SSC, IBPS, UPSC, NEET, Railway, and State PSC forms. 100% free and private in your browser.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-6 shadow-sm">
          <span>✨</span>
          <span>100% Client-Side • No Uploads • 100% Private</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
          Resize Photos &amp; Signatures for{' '}
          <span className="text-blue-600 dark:text-blue-400">Government Forms</span>
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          SSC, IBPS, UPSC, NEET, Railway &amp; more — free, instant, private.
          Hit exact pixel dimensions and strict KB limits with zero quality loss.
        </p>

        {/* Main Resize Tool */}
        <div className="mt-8 sm:mt-10 text-left">
          <ResizeTool />
        </div>

        {/* Trust Signals */}
        <div className="mt-10 sm:mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/60">
            <div className="text-2xl mb-1.5" role="img" aria-label="Lock">
              🔒
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
              Zero-Upload Privacy
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your photo never leaves your device. Processed entirely inside your browser memory.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/60">
            <div className="text-2xl mb-1.5" role="img" aria-label="Lightning">
              ⚡
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
              Instant Processing
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Direct HTML5 Canvas bicubic resampling and binary search byte targeting in milliseconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/60">
            <div className="text-2xl mb-1.5" role="img" aria-label="Mobile Phone">
              📱
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
              Works Anywhere
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Compatible with Android Chrome, iPhone Safari (HEIC supported), tablets, and PCs.
            </p>
          </div>
        </div>

        {/* PDF Compressor callout banner */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                Need to compress PDF marksheets or caste certificates?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Compress PDFs to under 100 KB, 200 KB, or 300 KB — 100% private in your browser.
              </p>
            </div>
          </div>
          <Link
            href="/compress-pdf"
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 shadow-sm"
          >
            Compress PDF Now &rarr;
          </Link>
        </div>
      </section>

      {/* Popular Exams Grid Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-950/60 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Popular Government Exam Form Presets
              </h2>
              <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Pre-configured with exact height, width, and file size limits according to official notifications.
              </p>
            </div>
            <Link
              href="/exams"
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group shrink-0"
            >
              Browse all exams &amp; categories
              <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {presets.map((preset) => (
              <ExamCard key={preset.id} preset={preset} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Ad Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <FAQBlock className="mb-12" />
        <AdSlot slotId="home-bottom-banner" />
      </section>
    </div>
  );
}
