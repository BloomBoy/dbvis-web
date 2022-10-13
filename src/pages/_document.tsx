import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { brandColor },
} = getConfig();
class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="sv" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
          <link rel="icon" type="image/svg+xml" href="/favicon/icon.svg" />
          <link rel="apple-touch-icon" href="/favicon/favicon-180.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="/favicon/safari-pinned-tab.svg"
            color={brandColor}
          />
          <meta name="msapplication-TileColor" content={brandColor} />
          <meta name="MobileOptimized" content="width" />
          <meta name="HandheldFriendly" content="true" />
          <meta name="theme-color" content={brandColor} />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body className="preload font-gotham">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
