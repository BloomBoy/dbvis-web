import getAppClient from '../src/utils/getAppClient.mjs';
import getMenues from './menues.mjs';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import tailwindConfig from '../tailwind.config.js';

const resolvedTailwindConfig = resolveConfig(tailwindConfig);

const primaryBrandColors = resolvedTailwindConfig.theme.colors.primary;

const primaryBrandColor =
  primaryBrandColors?.DEFAULT || primaryBrandColors?.[500];

const bodyBackground = resolvedTailwindConfig.theme.colors.bodyBackground;

/**
 * @returns {Promise<{ publicRuntimeConfig: { [key: string]: string } }>}
 */
export default async function generateBuildtimeData() {
  const appClient = await getAppClient();
  const menues = await getMenues(appClient);
  const { parameters: contentfulAppParameters } =
    await appClient.appInstallation.get({
      appDefinitionId: process.env.CF_APP_ID,
    });
  return {
    publicRuntimeConfig: {
      contentfulAppParameters,
      brandColor: primaryBrandColor,
      bodyBackground,
      menues,
    },
  };
}
