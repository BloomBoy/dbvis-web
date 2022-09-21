import type { WebAppManifest } from 'web-app-manifest';
import getConfig from 'next/config';
import simpleApiRoute from 'src/utils/simpleApiRoute';

const {
  publicRuntimeConfig: { contentfulAppParameters },
} = getConfig();

const TAGLINE = 'SQL Client and Editor';
const THEME_COLOR = '#24c780';
const BACKGROUND_COLOR = '#ffffff';

const handler = simpleApiRoute<WebAppManifest>(() => {
  return {
    $schema: 'https://json.schemastore.org/web-manifest-combined.json',
    name: `${TAGLINE} - ${contentfulAppParameters.siteName}`,
    short_name: contentfulAppParameters.siteName,
    start_url: './',
    display: 'browser',
    theme_color: THEME_COLOR,
    background_color: BACKGROUND_COLOR,
    description: TAGLINE,
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
