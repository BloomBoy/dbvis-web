import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SEOProvider } from 'src/components/SEO';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

const {
  publicRuntimeConfig: { contentfulAppParameters },
} = getConfig();

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const currentUrl = `${process.env.BASE_URL}${asPath}`;
  return (
    <SEOProvider
      description={contentfulAppParameters.siteDescription}
      image={contentfulAppParameters.siteImage}
      url={currentUrl}
      type="website"
      siteName={contentfulAppParameters.siteName}
      siteTwitterHandle={contentfulAppParameters.siteTwitterHandle}
      twitterCard="summary_large_image"
    >
      <Component {...pageProps} />
    </SEOProvider>
  );
}

export default MyApp;
