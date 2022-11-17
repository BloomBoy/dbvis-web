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
import PreloadFonts from 'src/utils/preloadFont';
import { PageConfigProvider } from 'src/hooks/usePageConfig';
import { PageContextProvider } from 'src/hooks/usePageContex';
import { WithGlobals, WithLayoutData } from 'src/utils/types';

const {
  publicRuntimeConfig: { contentfulAppParameters },
} = getConfig();

function MyApp(props: AppProps & { ua?: string }) {
  const { Component, pageProps, ua } = props;
  const { collectedData, pageContext } =
    pageProps as WithGlobals<WithLayoutData>;
  return (
    <PageConfigProvider appProps={props}>
      <UserAgentProvider userAgent={ua}>
        <PageContextProvider data={pageContext}>
          <CollectedDataProvider data={collectedData}>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
          </CollectedDataProvider>
        </PageContextProvider>
      </UserAgentProvider>
    </PageConfigProvider>
  );
}

const withProviders = composeHOCs(
  asHOC(InitialRenderProvider, {}),
  asHOC(PreloadFonts, {
    fonts: [
      {
        family: 'jetbrainsmono',
        weight: ['400', '700'],
        style: 'normal',
      },
      {
        family: 'AUTHENTIC Sans',
        weight: ['400', '700'],
        style: 'normal',
      },
    ],
  }),
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
