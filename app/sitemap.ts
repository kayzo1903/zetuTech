import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://zetutech.co.tz";

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/contact',
    '/terms&policy',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
  ];
}
