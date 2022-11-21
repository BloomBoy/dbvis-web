import React, { createContext, useContext, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SEOContext = createContext({
  siteName: '',
  siteKeywords: undefined as string[] | undefined,
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
  keywords?: string[];
  title?: string;
  url?: string;
  type: string;
  date?: string;
  twitterCard: 'summary_large_image' | 'summary';
  creatorTwitterHandle?: string;
  children?: React.ReactNode;
  mergeKeywords?: boolean;
};

/**
 * The props used by the SEO component.
 * They are optinal and will be used
 * to override the default values.
 */
export type SEOProps = Partial<InitialSEOProps>;

/**
 * We can use this component to
 * remove any unwanted elements from
 * the head tag of the page.
 */
const Void = () => {
  return null;
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
  keywords,
  mergeKeywords = true,
}: SEOProps): JSX.Element {
  const { siteName, siteKeywords } = useContext(SEOContext);
  const keywordString = useMemo(() => {
    if (mergeKeywords && (keywords == null || keywords.length === 0)) {
      return null;
    }
    if (keywords == null || keywords.length === 0) {
      return '';
    }
    const keywordSet = new Set<string>(
      siteKeywords != null && mergeKeywords
        ? [...keywords, ...siteKeywords]
        : keywords,
    );
    return [...keywordSet].join(', ');
  }, [keywords, mergeKeywords, siteKeywords]);
  return (
    <Head>
      {!!title && <title>{`${title} - ${siteName}`}</title>}
      {!!description && (
        <meta name="description" key="description" content={description} />
      )}
      {!!keywordString && (
        <meta name="keywords" key="keywords" content={keywordString} />
      )}
      {keywordString === '' && <Void key="keywords" />}
      {!!title && <meta property="og:title" key="og-title" content={title} />}
      {!!description && (
        <meta
          property="og:description"
          key="og-description"
          content={description}
        />
      )}
      {!!image && <meta property="og:image" key="og-image" content={image} />}
      {!!url && <meta property="og:url" key="og-url" content={url} />}
      {!!type && <meta property="og:type" key="og-type" content={type} />}
      {!!date && (
        <meta
          property="article:published_time"
          key="article-published_time"
          content={date}
        />
      )}
      {!!title && (
        <meta name="twitter:title" key="twitter-title" content={title} />
      )}
      {!!description && (
        <meta
          name="twitter:description"
          key="twitter-description"
          content={description}
        />
      )}
      {!!image && (
        <meta name="twitter:image" key="twitter-image" content={image} />
      )}
      {!!twitterCard && (
        <meta name="twitter:card" key="twitter-card" content={twitterCard} />
      )}
      {creatorTwitterHandle ? (
        <meta
          name="twitter:creator"
          key="twitter-creator"
          content={creatorTwitterHandle}
        />
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
  keywords,
  ...props
}: SEOProviderProps): JSX.Element {
  const { asPath } = useRouter();
  const currentUrl = `${process.env.BASE_URL}${asPath}`;
  const value = useMemo(
    () => ({
      siteName,
      siteKeywords: keywords,
    }),
    [siteName, keywords],
  );
  return (
    <SEOContext.Provider value={value}>
      <Head>
        <meta
          name="twitter:site"
          key="twitter-site"
          content={siteTwitterHandle}
        />
        <meta property="og:site_name" key="og-site_name" content={siteName} />
        <title>{siteName}</title>
      </Head>
      <InitialSEO url={currentUrl} keywords={keywords} {...props} />
      {children}
    </SEOContext.Provider>
  );
}
