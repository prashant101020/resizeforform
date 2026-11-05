import React from 'react';
import type { Preset, DocumentType } from '@/types';

export interface FAQBlockProps {
  preset?: Preset;
  documentType?: DocumentType;
  className?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQBlock({ preset, documentType, className = '' }: FAQBlockProps) {
  const docType = preset?.documentType || documentType || 'photo';

  const faqs: FAQItem[] = [
    {
      question: 'Is ResizeForForm completely free to use?',
      answer:
        'Yes, ResizeForForm is 100% free with no sign-ups, no subscriptions, and no watermarks on your downloaded images. You can resize unlimited photos and signatures.',
    },
    {
      question: 'Is my photo safe and private?',
      answer:
        'Yes, your photos and signatures never leave your device. All image cropping, dimension resizing, and file size optimization take place directly inside your web browser. Nothing is ever sent to or stored on any server.',
    },
  ];

  if (preset) {
    faqs.push({
      question: `What are the exact ${preset.documentType} requirements for ${preset.examName}?`,
      answer: `For ${preset.examName} (${preset.organization}), the required ${preset.documentType} specifications are ${preset.width} × ${preset.height} pixels with a file size between ${preset.minKB} KB and ${preset.maxKB} KB in ${preset.format.toUpperCase()} format. ${preset.notes || ''}`,
    });

    if (preset.documentType === 'photo') {
      faqs.push({
        question: `What background color should I use for ${preset.examName} photo?`,
        answer:
          'Indian government exams almost universally require a plain white or very light off-white background. Both ears and eyes must be clearly visible, and the face should occupy approximately 60% to 70% of the photograph frame.',
      });
      faqs.push({
        question: `Can I wear spectacles, glasses, or a cap in the ${preset.examName} photograph?`,
        answer:
          'Spectacles are discouraged and dark sunglasses or tinted lenses are strictly rejected. If you wear regular power glasses daily, ensure there is no flash reflection or glare on the lenses. Headwear (caps/hats) is not permitted, except for customary religious headgear that leaves the full face visible from forehead to chin.',
      });
    }
  }

  if (docType === 'signature') {
    faqs.push({
      question: 'How should I take a clear photo of my signature?',
      answer:
        'Sign with a clean black or dark blue ink pen on unruled pure white paper. Take the photo under bright, direct light (without your hand casting a shadow), and enable the "Signature cleanup" toggle in our tool to achieve a pure white background and crisp contrast.',
    });
  }

  faqs.push({
    question: 'What if the file size is still too large or too small for the exam portal?',
    answer:
      'If your file size exceeds the upper limit, switch to Custom Settings and slightly lower the target dimensions or crop tighter to eliminate unnecessary background. If the file is below the minimum limit, upload a higher-resolution original photo or set a slightly higher minimum KB target.',
  });

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 sm:p-8 shadow-sm space-y-6 ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
        <h2
          id="faq-heading"
          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <span>❓</span>
          <span>Frequently Asked Questions</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Everything you need to know about photo dimensions, file sizes, and form compliance.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50/50 dark:bg-gray-900/30 overflow-hidden transition-all duration-200"
          >
            <summary className="flex items-center justify-between p-4 sm:p-5 text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none select-none hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <span className="pr-4">{faq.question}</span>
              <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-150 dark:border-gray-800">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FAQBlock;
