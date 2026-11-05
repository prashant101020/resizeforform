import { Metadata } from 'next';
import Link from 'next/link';
import { presets, categoryPages, getPresetsByCategory } from '@/data/presets';
import { ExamCard } from '@/components/ExamCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import type { ExamCategory } from '@/types';

export const metadata: Metadata = {
  title: 'All Government Exam Photo Size Requirements — ResizeForForm',
  description:
    'Complete directory of official photo and signature size, dimension, and format requirements for SSC, IBPS, UPSC, NEET, Railway, and State PSC application forms.',
  alternates: {
    canonical: '/exams',
  },
};

interface CategoryGroup {
  id: ExamCategory;
  name: string;
  description: string;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'ssc',
    name: 'Staff Selection Commission (SSC)',
    description: 'SSC CGL, CHSL, MTS, GD Constable, and CPO photo & signature requirements.',
  },
  {
    id: 'banking',
    name: 'Banking & Insurance (IBPS / SBI)',
    description: 'IBPS PO, Clerk, SO, and SBI recruitment application dimensions.',
  },
  {
    id: 'railway',
    name: 'Railway Recruitment Board (RRB)',
    description: 'RRB NTPC, Group D, ALP, and Technician photo & signature specs.',
  },
  {
    id: 'nta',
    name: 'National Testing Agency (NTA)',
    description: 'NEET UG, CUET, and JEE Main photo, postcard, and signature dimensions.',
  },
  {
    id: 'upsc',
    name: 'Union Public Service Commission (UPSC)',
    description: 'UPSC Civil Services (IAS/IPS), NDA, and CDS photo & signature guidelines.',
  },
  {
    id: 'state',
    name: 'State PSC & Police Exams',
    description: 'UPPSC, BPSC, MPPSC, and state government recruitment portals.',
  },
  {
    id: 'identity',
    name: 'Identity & Official Documents',
    description: 'Passport, PAN Card, and general identity photo specifications.',
  },
];

export default function ExamsHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'All Exam Requirements' },
        ]}
        className="mb-6"
      />

      {/* Main Heading */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          All Exam Photo &amp; Signature Size Requirements
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Browse verified pixel dimensions, minimum and maximum file sizes (KB), and file formats
          for every major central and state government recruitment examination in India.
        </p>

        {/* Category Target Quick Links */}
        <div className="mt-6 pt-6 border-t border-gray-150 dark:border-gray-850">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Quick Size Target Calculators
          </p>
          <div className="flex flex-wrap gap-2.5">
            {categoryPages.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
              >
                <span>⚡</span>
                <span>{cat.heading}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Categories Listing */}
      <div className="space-y-12">
        {CATEGORY_GROUPS.map((group) => {
          const groupPresets = getPresetsByCategory(group.id);
          if (groupPresets.length === 0) return null;

          return (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`heading-${group.id}`}
              className="scroll-mt-20"
            >
              <div className="mb-4">
                <h2
                  id={`heading-${group.id}`}
                  className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <span>{group.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {groupPresets.length} {groupPresets.length === 1 ? 'spec' : 'specs'}
                  </span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {group.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {groupPresets.map((preset) => (
                  <ExamCard key={preset.id} preset={preset} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Ad slot & bottom notice */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <AdSlot slotId="exams-hub-bottom" className="mb-8" />
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Can’t find your exam? Use our{' '}
          <Link href="/" className="text-blue-600 dark:text-blue-400 underline font-medium">
            Custom Resize Tool
          </Link>{' '}
          to manually set any width, height, and KB limit, or{' '}
          <Link href="/about" className="text-blue-600 dark:text-blue-400 underline font-medium">
            contact us
          </Link>{' '}
          to request a new preset.
        </div>
      </div>
    </div>
  );
}
