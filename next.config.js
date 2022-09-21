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
    },
    publicRuntimeConfig,
  };
};
