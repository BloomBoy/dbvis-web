import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SEOProvider } from 'src/components/SEO';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const currentUrl = `${process.env.BASE_URL}${asPath}`;
  return (
    <SEOProvider
      description="DbVisualizer is the SQL client and database tool with the highest user satisfaction. It connects to all popular databases and runs on Win, Mac & Linux."
      image="https://images.ctfassets.net/pzt5zr5p8m4g/4Dc2mAbvMEa3Jd5O9YL9aS/e59e5d08adaa1d09c137903e6cfe6fa7/dbvis-og.jpeg"
      url={currentUrl}
      type="website"
      siteName="DbVisualizer"
      siteTwitterHandle="@dbvisualizer"
      twitterCard="summary_large_image"
    >
      <Component {...pageProps} />
    </SEOProvider>
  );
}

export default MyApp;
