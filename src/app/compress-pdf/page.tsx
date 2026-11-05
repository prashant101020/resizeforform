import { Metadata } from 'next';
import { PdfCompressTool } from '@/components/PdfCompressTool';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { SITE_URL } from '@/app/sitemap';

export const metadata: Metadata = {
  title: 'Compress PDF to 100 KB, 200 KB, 300 KB for Exam Forms',
  description:
    'Free online tool to compress PDF documents, marksheets, and certificates to under 100 KB, 200 KB, or 300 KB for UPSC, SSC, State PSC, and government jobs. 100% private in-browser.',
  alternates: {
    canonical: `${SITE_URL}/compress-pdf`,
  },
  openGraph: {
    title: 'Compress PDF for Government Forms — Free & Private',
    description:
      'Compress PDF marksheets, certificates, and job applications to exact KB limits. Zero upload — 100% client-side privacy.',
    url: `${SITE_URL}/compress-pdf`,
    type: 'website',
  },
};

export default function CompressPdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Compress PDF' },
        ]}
        className="mb-6"
      />

      {/* Header section */}
      <div className="text-center sm:text-left mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
          <span>📄 Free PDF Compressor</span>
          <span>•</span>
          <span>100% Client-Side</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Compress PDF to 100 KB, 200 KB or 300 KB for Forms
        </h1>

        <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          Quickly reduce the file size of your PDF marksheets, caste certificates, and identity documents to meet strict
          government recruitment upload limits. No files are uploaded to any remote server.
        </p>
      </div>

      {/* PDF Tool */}
      <section aria-label="PDF Compression Tool" className="mb-12">
        <PdfCompressTool />
      </section>

      {/* Guidance Section */}
      <section className="mb-12 p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Government Form PDF Upload Guidelines
        </h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Major exam recruitment portals like <strong>UPSC OTR</strong>, <strong>State PSCs (BPSC, UPPSC, MPSC, TNPSC)</strong>, and <strong>High Court registries</strong> usually require scanned supporting certificates (10th/12th certificate, degree diploma, caste certificate, EWS certificate, disability certificate) in PDF format within <strong>100 KB to 300 KB</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Scan at 150 DPI:</strong> When scanning physical documents on a flatbed scanner or phone scanner app (Adobe Scan, CamScanner), choose 150 DPI grayscale or color to keep original file sizes manageable.
            </li>
            <li>
              <strong>Single-page certificates:</strong> Ensure borders and unnecessary table margins are cropped out before saving as PDF.
            </li>
            <li>
              <strong>Legibility:</strong> Always inspect your compressed PDF after downloading to verify that all certificate numbers, university seals, and signatures remain clearly readable.
            </li>
          </ul>
        </div>
      </section>

      {/* Ad slot */}
      <AdSlot slotId="compress-pdf-bottom" />
    </div>
  );
}

