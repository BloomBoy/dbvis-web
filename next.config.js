/** @type {import('next').NextConfig} */

const BASE_URL = (() => {
  if (process.env.DEPLOY_URL) {
    return process.env.DEPLOY_URL;
  } else if (process.env.VERCEL_URL) {
    if (process.env.VERCEL_ENV === 'development')
      return `http://${process.env.VERCEL_URL}`;
    else return `http://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
})();

/**
 * @param {string} phase
 * @param {{ defaultConfig: import('next').NextConfig }} ctx
 * @returns {Promise<NextConfig>}
 */
module.exports = async function nextConfig() {
  const { default: generateBuildtimeData } = await import(
    './buildtimeData/index.mjs'
  );
  const { publicRuntimeConfig } = await generateBuildtimeData();
  return {
    reactStrictMode: true,
    swcMinify: true,
    env: {
      BASE_URL,
      CF_DELIVERY_ACCESS_TOKEN: process.env.CF_DELIVERY_ACCESS_TOKEN,
      CF_SPACE_ID: process.env.CF_SPACE_ID,
    },
    images: {
      domains: ['images.ctfassets.net'],
    },
    publicRuntimeConfig,
    async rewrites() {
      return {
        beforeFiles: [
          {
            source: '/manifest.json',
            destination: '/api/manifest',
          },
        ],
        afterFiles: [
          {
            source: '/product_download/:path*',
            destination: '/api/product_download',
          },
        ],
      };
    },
  };
};
