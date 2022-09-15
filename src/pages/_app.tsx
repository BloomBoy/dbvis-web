import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RootSEO } from 'src/components/SEO';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <RootSEO />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
