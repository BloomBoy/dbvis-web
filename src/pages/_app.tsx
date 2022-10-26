import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageLayout from 'src/components/PageLayout';
import { SEOProvider } from 'src/components/SEO';
import asHOC from 'src/utils/asHOC';
import composeHOCs from 'src/utils/composeHOCs';
import getConfig from 'next/config';
import { CollectedDataProvider } from 'src/hooks/useCollectedData';
import { InitialRenderProvider } from 'src/hooks/useIsInitialRender';
const {
  publicRuntimeConfig: { contentfulAppParameters },
} = getConfig();

function MyApp({ Component, pageProps }: AppProps) {
  const { collectedData } = pageProps as { collectedData?: unknown };
  return (
    <CollectedDataProvider data={collectedData}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </CollectedDataProvider>
  );
}

const withProviders = composeHOCs(
  asHOC(InitialRenderProvider, {}),
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
