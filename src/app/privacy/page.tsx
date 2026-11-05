import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — ResizeForForm',
  description:
    'ResizeForForm is a 100% client-side tool. Your photos, signatures, and documents never leave your browser or device.',
};

export default function PrivacyPage() {
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
            Privacy Policy
          </li>
        </ol>
      </nav>

      {/* Header section */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Last updated: November 2026
        </p>
      </div>

      {/* Main content */}
      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
        {/* Core guarantee highlight */}
        <div className="p-5 sm:p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
          <div className="flex items-start gap-3">
            <span className="text-2xl" role="img" aria-label="Security Shield">
              🛡️
            </span>
            <div>
              <h2 className="text-lg font-bold text-blue-950 dark:text-blue-200">
                Core Privacy Guarantee: Zero-Upload Architecture
              </h2>
              <p className="mt-1 text-sm sm:text-base text-blue-900 dark:text-blue-300/90 leading-normal">
                ResizeForForm is engineered from the ground up as a pure client-side application.
                All image resizing, signature adjustments, cropping, and PDF compressions run
                directly inside your web browser using HTML5 Canvas and JavaScript. No image data
                is ever transmitted to our servers or any third-party server.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section aria-labelledby="heading-no-image-collection">
          <h2
            id="heading-no-image-collection"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            1. No Image or Document Data Collection
          </h2>
          <p>
            When you select a passport photograph, signature file, thumb impression, or certificate
            to resize, the file is read locally by your device’s browser. The pixels are manipulated
            entirely within the memory of your local device. We do not maintain any storage,
            database, cache, or external processing pipeline for user files. Once you close or reload
            the tab, all memory containing your files is instantly released by your browser.
          </p>
        </section>

        {/* Section 2 */}
        <section aria-labelledby="heading-no-accounts">
          <h2
            id="heading-no-accounts"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            2. No Accounts, Sign-ups, or Personal Information
          </h2>
          <p>
            You can use all features of ResizeForForm without registering for an account,
            providing your name, submitting an email address, or linking social profiles. We do not
            collect identity information, exam registration numbers, or phone numbers.
          </p>
        </section>

        {/* Section 3 */}
        <section aria-labelledby="heading-cookies-analytics">
          <h2
            id="heading-cookies-analytics"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            3. Cookies and Analytics
          </h2>
          <p>
            We do not use tracking cookies, advertising identifiers, or cross-site tracking pixels.
            To understand overall site performance and uptime, we may use privacy-preserving analytics
            (such as Vercel Web Analytics), which operates without storing cookies on your device, does
            not collect personal identifiable information (PII), and respects your browser’s Do Not Track
            settings.
          </p>
        </section>

        {/* Section 4 */}
        <section aria-labelledby="heading-security">
          <h2
            id="heading-security"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            4. Offline Capability and Security
          </h2>
          <p>
            Because all processing logic is contained within client-side code, ResizeForForm can
            operate completely offline once the page has loaded. You are welcome to test this yourself:
            load our website, disconnect your Wi-Fi or mobile data, and process your photograph. The
            entire resizing and compression routine will execute seamlessly without network access.
          </p>
        </section>

        {/* Section 5 */}
        <section aria-labelledby="heading-third-party">
          <h2
            id="heading-third-party"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            5. Third-Party Services
          </h2>
          <p>
            ResizeForForm is hosted as a static website on modern content delivery networks
            (such as Vercel). Standard web server logs (such as IP addresses and request timestamps)
            may be recorded temporarily by infrastructure providers to prevent abuse and ensure
            reliable service delivery.
          </p>
        </section>

        {/* Section 6 */}
        <section aria-labelledby="heading-contact">
          <h2
            id="heading-contact"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            6. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or wish to provide feedback regarding
            security or privacy practices, you can reach out to us at:
          </p>
          <div className="mt-3 inline-block p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm sm:text-base font-mono">
            <a
              href="mailto:contact@resizeforform.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact@resizeforform.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
