import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SEOProvider } from 'src/components/SEO';
import asHOC from 'src/utils/asHOC';
import composeHOCs from 'src/utils/composeHOCs';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { contentfulAppParameters },
} = getConfig();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

const withProviders = composeHOCs(
  asHOC(SEOProvider, {
    title: contentfulAppParameters.siteTagline,
    description: contentfulAppParameters.siteDescription,
    image: contentfulAppParameters.siteImage,
    type: 'website',
    siteName: contentfulAppParameters.siteName,
    siteTwitterHandle: contentfulAppParameters.siteTwitterHandle,
    twitterCard: 'summary_large_image',
  }),
);

export default withProviders(MyApp);
