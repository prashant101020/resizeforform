import { MetadataRoute } from 'next';
import { presets, categoryPages } from '@/data/presets';

export const SITE_URL = 'https://resizeforform.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/exams`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compress-pdf`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic exam preset routes
  const examRoutes: MetadataRoute.Sitemap = presets.map((preset) => {
    let lastModifiedDate = now;
    if (preset.lastVerified) {
      const parsed = new Date(preset.lastVerified);
      if (!isNaN(parsed.getTime())) {
        lastModifiedDate = parsed;
      }
    }
    return {
      url: `${SITE_URL}/${preset.slug}`,
      lastModified: lastModifiedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  // Dynamic category routes
  const categoryRoutes: MetadataRoute.Sitemap = categoryPages.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...examRoutes, ...categoryRoutes];
}
