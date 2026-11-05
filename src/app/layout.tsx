import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_URL } from '@/app/sitemap';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ResizeForForm — Resize Photos for Government Forms',
    template: '%s | ResizeForForm',
  },
  description:
    'Free, instant, client-side photo and signature resizer for Indian government exam forms (SSC, IBPS, UPSC, NEET, Railway). 100% private — your photos never leave your device.',
  keywords: [
    'photo resize for government form',
    'ssc photo resizer',
    'ibps photo signature resize',
    'neet photo resize 10 to 200 kb',
    'upsc photo resize',
    'signature resize 10 to 20 kb',
    'photo resize 20 to 50 kb',
    'online photo compressor without uploading',
  ],
  authors: [{ name: 'ResizeForForm Team' }],
  creator: 'ResizeForForm',
  publisher: 'ResizeForForm',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'ResizeForForm',
    title: 'ResizeForForm — Resize Photos for Government Forms',
    description:
      'Resize and compress photos & signatures to exact dimensions and KB limits for SSC, IBPS, UPSC, NEET, Railway forms. 100% private & client-side.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResizeForForm — Resize Photos for Government Forms',
    description:
      'Resize and compress photos & signatures to exact dimensions and KB limits for Indian exam forms. 100% client-side & private.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ResizeForForm',
  url: SITE_URL,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description:
    'Client-side image and signature resizer for Indian government exams including SSC, IBPS, UPSC, NEET, and Railway recruitment forms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased selection:bg-blue-500 selection:text-white">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
