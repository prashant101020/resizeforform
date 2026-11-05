import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllPageSlugs,
  getPresetBySlug,
  getCategoryBySlug,
  getPresetsForCategory,
  getRelatedPresets,
} from '@/data/presets';
import { ResizeTool } from '@/components/ResizeTool';
import { SpecTable } from '@/components/SpecTable';
import { FAQBlock } from '@/components/FAQBlock';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ExamCard } from '@/components/ExamCard';
import { AdSlot } from '@/components/AdSlot';
import { SITE_URL } from '@/app/sitemap';
import type { Preset, CategoryPage } from '@/types';

interface PageProps {
  params: { slug: string };
}

/**
 * Pre-generate all static paths for export
 */
export function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate SEO metadata for exam presets and category pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const preset = getPresetBySlug(slug);

  if (preset) {
    const docLabel =
      preset.documentType === 'photo'
        ? 'Photo'
        : preset.documentType === 'signature'
        ? 'Signature'
        : 'Thumb Impression';

    const title = `${preset.examShortName} ${docLabel} Resize to ${preset.maxKB} KB — Free Online Tool | ResizeForForm`;
    const description = `Resize and compress ${preset.examName} ${docLabel.toLowerCase()} to ${preset.width}×${preset.height} px and ${preset.minKB}-${preset.maxKB} KB in ${preset.format.toUpperCase()} format. 100% free, private in-browser resizing.`;

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${preset.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${preset.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  }

  const category = getCategoryBySlug(slug);
  if (category) {
    const title = `${category.title} | ResizeForForm`;
    const description = category.description;

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${category.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${category.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  }

  return {
    title: 'Page Not Found — ResizeForForm',
  };
}

export default function DynamicPage({ params }: PageProps) {
  const { slug } = params;
  const preset = getPresetBySlug(slug);

  if (preset) {
    return <ExamPresetView preset={preset} />;
  }

  const category = getCategoryBySlug(slug);
  if (category) {
    return <CategoryView category={category} />;
  }

  notFound();
}

/**
 * Layout for Exam Preset Pages (e.g. /ssc-cgl-photo-resize-20-50kb)
 */
function ExamPresetView({ preset }: { preset: Preset }) {
  const docLabel =
    preset.documentType === 'photo'
      ? 'Photo'
      : preset.documentType === 'signature'
      ? 'Signature'
      : 'Thumb Impression';

  const relatedPresets = getRelatedPresets(preset);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Exams', href: '/exams' },
          { label: `${preset.examShortName} ${docLabel}` },
        ]}
        className="mb-6"
      />

      {/* Main Page Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
          <span>{preset.organization}</span>
          <span>•</span>
          <span>Official Spec</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {preset.examName} {docLabel} Resize — {preset.width}×{preset.height} px, {preset.minKB}-{preset.maxKB} KB
        </h1>

        <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          Quickly crop, resize, and compress your {preset.examShortName} {docLabel.toLowerCase()} to the exact
          specifications required by {preset.organization}. Instant, 100% private in your browser.
        </p>
      </div>

      {/* Warning banner if spec is unverified */}
      {!preset.verified && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3 shadow-sm"
        >
          <span className="text-xl" aria-hidden="true">
            ⚠️
          </span>
          <div>
            <p className="font-bold text-amber-950 dark:text-amber-100">
              Notification Verification Pending
            </p>
            <p className="text-xs sm:text-sm mt-0.5 text-amber-900/90 dark:text-amber-200/90">
              This specification was drafted from previous cycle notifications. Please double-check the current
              official notification brochure at{' '}
              <a
                href={preset.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-amber-950 dark:hover:text-white"
              >
                {preset.organization} website
              </a>{' '}
              before final submission.
            </p>
          </div>
        </div>
      )}

      {/* Resize Tool Component with initial preset */}
      <section aria-label="Resize Tool" className="mb-12">
        <ResizeTool initialPreset={preset} />
      </section>

      {/* Specification Table */}
      <section aria-label="Official Specifications" className="mb-12">
        <SpecTable preset={preset} />
      </section>

      {/* Helpful Exam Requirements Guidance */}
      <section
        aria-labelledby="guidance-heading"
        className="mb-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800"
      >
        <h2
          id="guidance-heading"
          className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Important Guidelines for {preset.examName} {docLabel}
        </h2>
        <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            The {preset.organization} application server automatically validates image dimensions
            ({preset.width} × {preset.height} px) and file size ({preset.minKB} KB to {preset.maxKB} KB).
            Files that fall outside these limits will trigger an upload error on the portal.
          </p>
          <p>
            {preset.documentType === 'photo'
              ? 'Ensure your passport photo has a crisp white or light background without shadows. Keep your head straight, looking directly into the camera, with both eyes and ears clearly uncovered.'
              : preset.documentType === 'signature'
              ? 'Sign in running handwriting using a black or dark blue ink pen on unruled white paper. Do not use all capital letters for your signature, as forms typically reject capital-letter signatures.'
              : 'Provide a clear, smudge-free thumb impression on unruled white paper using blue or black ink.'}
          </p>
          {preset.notes && (
            <p className="pt-2 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 border-t border-gray-200 dark:border-gray-700">
              📌 Official Note: {preset.notes}
            </p>
          )}
        </div>
      </section>

      {/* Related Presets for Same Exam */}
      {relatedPresets.length > 0 && (
        <section aria-labelledby="related-heading" className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2
              id="related-heading"
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
            >
              Other {preset.examShortName} Form Requirements
            </h2>
            <Link
              href="/exams"
              className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all exams &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPresets.map((rel) => (
              <ExamCard key={rel.id} preset={rel} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ & Ad Slot */}
      <section aria-label="Frequently Asked Questions" className="mb-10">
        <FAQBlock preset={preset} />
      </section>

      <AdSlot slotId={`exam-${preset.id}-bottom`} />
    </div>
  );
}

/**
 * Layout for Category Target Pages (e.g. /photo-resize-to-50kb)
 */
function CategoryView({ category }: { category: CategoryPage }) {
  const matchingPresets = getPresetsForCategory(category);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Exams', href: '/exams' },
          { label: category.heading },
        ]}
        className="mb-6"
      />

      {/* Main Category Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
          <span>🎯 Target Size: Under {category.maxKB} KB</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {category.heading}
        </h1>

        <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Resize Tool Component */}
      <section aria-label="Resize Tool" className="mb-12">
        <ResizeTool />
      </section>

      {/* Matching Exam Presets Grid */}
      {matchingPresets.length > 0 && (
        <section aria-labelledby="matching-heading" className="mb-12">
          <div className="mb-4">
            <h2
              id="matching-heading"
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
            >
              Exams Requiring {category.documentType === 'photo' ? 'Photos' : 'Signatures'} Under {category.maxKB} KB
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Select your specific exam to prefill exact pixel dimensions alongside the {category.maxKB} KB limit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingPresets.map((preset) => (
              <ExamCard key={preset.id} preset={preset} />
            ))}
          </div>
        </section>
      )}

      {/* Category FAQs & Ad Slot */}
      <section aria-label="Frequently Asked Questions" className="mb-10">
        <FAQBlock documentType={category.documentType} />
      </section>

      <AdSlot slotId={`cat-${category.slug}-bottom`} />
    </div>
  );
}
