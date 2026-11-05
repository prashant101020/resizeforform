import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — ResizeForForm',
  description:
    'Learn why ResizeForForm was built: a free, privacy-first, client-side tool to resize exam photos and signatures for Indian government recruitment forms.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 focus-visible:underline"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
            About
          </li>
        </ol>
      </nav>

      {/* Header section */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          About ResizeForForm
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          A fast, privacy-first utility built specifically for Indian government job applicants and students.
        </p>
      </div>

      {/* Main content body */}
      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
        {/* Why this tool exists */}
        <section aria-labelledby="heading-why">
          <h2
            id="heading-why"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Why We Built ResizeForForm
          </h2>
          <p>
            Anyone who has filled out an online application for SSC, IBPS, UPSC, NEET, or Railway
            recruitment knows the frustration of strict photo and signature requirements:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              “File size must be strictly between 20 KB and 50 KB.”
            </li>
            <li>
              “Dimensions must be exactly 100 × 120 pixels.”
            </li>
            <li>
              “Signatures must be on clear white background with black/blue ink.”
            </li>
          </ul>
          <p className="mt-4">
            Most online image resizers upload your sensitive ID photos to remote third-party
            servers, fill their screens with aggressive popups, or fail to hit both the required
            pixel dimensions and the exact file size thresholds at the same time.
          </p>
          <p className="mt-3">
            ResizeForForm was created to fix that: a clean, instant tool that runs 100% inside your
            web browser without uploading anything.
          </p>
        </section>

        {/* How it works */}
        <section aria-labelledby="heading-how-it-works">
          <h2
            id="heading-how-it-works"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            How It Works Under the Hood
          </h2>
          <p>
            ResizeForForm uses modern browser APIs (HTML5 Canvas, File API, and Web Workers) to
            process everything locally on your phone or computer:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                1. Local Dimension Resizing
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Smooth bicubic-sampled canvas scaling ensures sharp, legible photos and signatures at the required dimensions.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                2. Binary Search Compression
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                An iterative binary search algorithm finds the maximum visual quality that fits within the form’s exact KB limit.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                3. Zero-Upload Security
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Your images never leave your memory. Once processed, you download the file directly from your device.
              </p>
            </div>
          </div>
        </section>

        {/* Suggesting Exams & Reporting Errors */}
        <section aria-labelledby="heading-contribute">
          <h2
            id="heading-contribute"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Request an Exam or Report a Spec Change
          </h2>
          <p>
            Exam notifications change year to year. While we periodically verify dimensions and
            file size limits against official notification PDFs from exam boards, we welcome your
            feedback!
          </p>
          <p className="mt-3">
            If an exam specification has changed or if there is an exam you’d like us to add,
            please email us with the exam name and official notification link:
          </p>
          <div className="mt-4 inline-block p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm sm:text-base font-mono">
            <a
              href="mailto:contact@resizeforform.com?subject=Exam%20Preset%20Suggestion%20or%20Update"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact@resizeforform.com
            </a>
          </div>
        </section>

        {/* Call to action */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
          >
            Resize a Photo Now
          </Link>
          <Link
            href="/exams"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white font-semibold transition"
          >
            Browse All Exam Requirements
          </Link>
        </div>
      </div>
    </div>
  );
}
