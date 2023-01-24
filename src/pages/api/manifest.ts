import type { WebAppManifest } from 'web-app-manifest';
import getConfig from 'next/config';
import simpleApiRoute from 'src/utils/simpleApiRoute';

const {
  publicRuntimeConfig: { contentfulAppParameters, brandColor, bodyBackground },
} = getConfig();

const handler = simpleApiRoute<WebAppManifest>((_, headers) => {
  headers(
    'Cache-Control',
    'public, max-age=604800, stale-while-revalidate=86400',
  );

  return {
    $schema: 'https://json.schemastore.org/web-manifest-combined.json',
    name: `${contentfulAppParameters.siteTagline} - ${contentfulAppParameters.siteName}`,
    short_name: contentfulAppParameters.siteName,
    start_url: './',
    display: 'browser',
    theme_color: brandColor,
    background_color: bodyBackground,
    description: contentfulAppParameters.siteDescription,
    icons: [
      {
        src: '/favicon/favicon-16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon/favicon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
});

export default handler;
