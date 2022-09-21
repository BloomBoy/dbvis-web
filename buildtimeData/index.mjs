import getAppClient from '../src/utils/getAppClient.mjs';

/**
 * @returns {Promise<{ publicRuntimeConfig: { [key: string]: string } }>}
 */
export default async function generateBuildtimeData() {
  const appClient = await getAppClient();
  const { parameters: contentfulAppParameters } =
    await appClient.appInstallation.get({
      appDefinitionId: process.env.CF_APP_ID,
    });
  return {
    publicRuntimeConfig: {
      contentfulAppParameters,
    },
  };
}
