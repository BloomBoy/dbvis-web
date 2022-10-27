import '../styles/globals.css';
import App, { AppContext, AppProps } from 'next/app';
import PageLayout from 'src/components/PageLayout';
import { SEOProvider } from 'src/components/SEO';
import asHOC from 'src/utils/asHOC';
import composeHOCs from 'src/utils/composeHOCs';
import getConfig from 'next/config';
import { CollectedDataProvider } from 'src/hooks/useCollectedData';
import { InitialRenderProvider } from 'src/hooks/useIsInitialRender';
import { UserAgentProvider } from 'src/hooks/useCurrentBrowser';
const {
  publicRuntimeConfig: { contentfulAppParameters },
} = getConfig();

function MyApp({ Component, pageProps, ua }: AppProps & { ua?: string }) {
  const { collectedData } = pageProps as { collectedData?: unknown };
  return (
    <UserAgentProvider userAgent={ua}>
      <CollectedDataProvider data={collectedData}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </CollectedDataProvider>
    </UserAgentProvider>
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

const getInitialProps =
  process.env.NODE_ENV === 'development'
    ? async (appCtx: AppContext) => {
        const ua = appCtx.ctx.req?.headers?.['user-agent'];
        const ret = await App.getInitialProps(appCtx);
        return { ...ret, ua };
      }
    : undefined;

export default Object.assign(withProviders(MyApp), { getInitialProps });
