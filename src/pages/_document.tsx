import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

const BASE_URL = process.env.BASE_URL;

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="sv" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="icon"
            type="image/x-icon"
            href={`${String(BASE_URL)}/favicon/favicon.ico`}
          />
          <link
            rel="icon"
            href={`${String(BASE_URL)}/favicon/icon.svg`}
            type="image/svg+xml"
          />
          <link
            rel="apple-touch-icon"
            href={`${String(BASE_URL)}/favicon/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${String(BASE_URL)}/favicon/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${String(BASE_URL)}/favicon/favicon-16x16.png`}
          />
          <link
            rel="mask-icon"
            href={`${String(BASE_URL)}/favicon/safari-pinned-tab.svg`}
            color="#ffffff"
          />
          <meta name="msapplication-TileColor" content="#ec4a58" />
          <meta name="MobileOptimized" content="width" />
          <meta name="HandheldFriendly" content="true" />
          <meta name="theme-color" content="#ec4a58" />
          <link rel="manifest" href={`${String(BASE_URL)}/manifest.json`} />
        </Head>
        <body className="preload">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;