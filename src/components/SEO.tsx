import { createContext, useContext, useMemo } from 'react';
import Head from 'next/head';

const SEOContext = createContext({
  siteName: '',
});

/**
 * The props used by the SEO component
 * These are not optional for the initial
 * alias component because we want to
 * enforce the use of the SEO component
 * in the root of the application.
 *
 * The defaul title is set
 * in a different manner and is optional
 * here as well.
 */
type InitialSEOProps = {
  description: string;
  image: string;
  url: string;
  type: string;
  date?: string;
  twitterCard: 'summary_large_image' | 'summary';
  creatorTwitterHandle?: string;
  children?: React.ReactNode;
};

/**
 * The props used by the SEO component.
 * They are optinal and will be used
 * to override the default values.
 */
export type SEOProps = {
  [key in 'title' | keyof InitialSEOProps]?: (InitialSEOProps & {
    title: string;
  })[key];
};

/**
 * The SEO component implementation
 * it sets all meta fields for the
 * application.
 *
 * Next.JS automates the deduplication
 * of the meta tags that do not support
 * multiple values.
 *
 * @param props The props used by the component
 */
export default function SEO({
  title,
  description,
  image,
  url,
  type,
  date,
  twitterCard,
  creatorTwitterHandle,
  children,
}: SEOProps): JSX.Element {
  const { siteName } = useContext(SEOContext);
  return (
    <Head>
      {!!title && <title>{`${title} - ${siteName}`}</title>}
      {!!description && <meta name="description" content={description} />}
      {!!title && <meta property="og:title" content={title} />}
      {!!description && (
        <meta property="og:description" content={description} />
      )}
      {!!image && <meta property="og:image" content={image} />}
      {!!url && <meta property="og:url" content={url} />}
      {!!type && <meta property="og:type" content={type} />}
      {!!date && <meta property="article:published_time" content={date} />}
      {!!title && <meta name="twitter:title" content={title} />}
      {!!description && (
        <meta name="twitter:description" content={description} />
      )}
      {!!image && <meta name="twitter:image" content={image} />}
      {!!twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {creatorTwitterHandle ? (
        <meta name="twitter:creator" content={creatorTwitterHandle} />
      ) : null}
      {children}
    </Head>
  );
}

/**
 * The alias component for the SEO component
 * it sets the default values for the SEO component
 * by enforcing all parameters to be required.
 */
const InitialSEO: React.FC<InitialSEOProps> = SEO;

type SEOProviderProps = InitialSEOProps & {
  siteName: string;
  siteTwitterHandle: string;
  description: string;
};

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
  children,
  ...props
}: SEOProviderProps): JSX.Element {
  const value = useMemo(
    () => ({
      siteName,
    }),
    [siteName],
  );
  return (
    <SEOContext.Provider value={value}>
      <InitialSEO {...props}>
        <title>{siteName}</title>
        <meta name="twitter:site" content={siteTwitterHandle} />
        <meta property="og:site_name" content={siteName} />
      </InitialSEO>
      {children}
    </SEOContext.Provider>
  );
}
