import Head from 'next/head';
import { createContext } from 'react';

export const SITE_NAME = 'DbVisualizer';

export const TWITTER_HANDLE = '@dbvisualizer';

const SEOContext = createContext({
  siteName,
});

export default function SEO({
  title,
  description,
  image,
  url,
  type,
  date,
  creatorTwitterHandle,
  children,
}: {
  title?: string;
  description: string;
  image: string;
  url: string;
  type: string;
  date: string;
  creatorTwitterHandle?: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <Head>
      {title ? <title>{`${title} - ${SITE_NAME}`}</title> : null}
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="sv_SE" />
      <meta property="article:published_time" content={date} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      {creatorTwitterHandle ? (
        <meta name="twitter:creator" content={creatorTwitterHandle} />
      ) : null}
      {children}
    </Head>
  );
}

/**
 * This is the base SEO component that should wrap your entire
 * website in `_app.tsx`.
 * It is used to set the default SEO values for the entire site.
 * use the regular SEO component for individual pages.
 *
 * @returns Head tag meant to be rendered in _app.tsx
 * @see /src/pages/_app.tsx
 */
export function SEOProvider({
  siteName,
  siteTwitterHandle,
  description,
}: {
  siteName: string;
  siteTwitterHandle: string;
  description: string;
}) {
  return (
    <SEO
      description={description}
    >
      <title>{siteName}</title>
      <meta name="twitter:site" content={siteTwitterHandle} />
      <meta property="og:site_name" content={siteName} />
    </SEO>
  );
}
