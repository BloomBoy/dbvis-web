/**
 * This is a .mjs file instead of a .ts file because it is used in the
 * next.config.js file, which is a .js file ran before the TypeScript
 * compiler runs.
 */
import JWT from 'jsonwebtoken';
import axios from 'axios';
import contentfulManagement from 'contentful-management';

/**
 * @returns {Promise<{
 *   sys: {
 *     type: 'AppAccessToken',
 *     appDefinition: import('contentful').Link<'AppDefinition'>,
 *     createdAt: string,
 *     createdBy: import('contentful').Link<'User'>,
 *     updatedAt: string,
 *     updatedBy: import('contentful').Link<'User'>,
 *     expiresAt: string,
 *     space: import('contentful').Link<'Space'>,
 *   };
 *   token: string
 * }>}
 */
async function getAccessToken() {
  const jwt = JWT.sign({}, process.env.CF_APP_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '10m',
    issuer: process.env.CF_APP_ID,
  });
  const res = await axios.request({
    method: 'POST',
    url: `https://api.contentful.com/spaces/${process.env.CF_APP_SPACE_ID}/environments/${process.env.CF_APP_ENVIRONMENT_ID}/app_installations/${process.env.CF_APP_ID}/access_tokens`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return res.data;
}

/**
 * @type {{ client: import('contentful-management').PlainClientAPI; tokenExpires: number } | undefined}
 */
let cachedClient;

/**
 * How long in milliseconds to require the token to
 * still be valid for before requesting a new one.
 */
const VALID_TOKEN_MARGIN = 60000;

/**
 * Get a Contentful Management API client.
 *
 * Uses a cached client if it is still valid with a
 * margin of {@link VALID_TOKEN_MARGIN} milliseconds.
 *
 * @returns {Promise<contentfulManagement.PlainClientAPI>} A Contentful Management API client.
 */
export default async function getAppClient() {
  if (
    !cachedClient ||
    cachedClient.tokenExpires < Date.now() + VALID_TOKEN_MARGIN
  ) {
    const {
      token,
      sys: { expiresAt },
    } = await getAccessToken();
    cachedClient = {
      client: contentfulManagement.createClient(
        {
          accessToken: token,
        },
        {
          type: 'plain',
          defaults: {
            spaceId: process.env.CF_APP_SPACE_ID,
            environmentId: process.env.CF_APP_ENVIRONMENT_ID,
          },
        },
      ),
      tokenExpires: new Date(expiresAt).getTime(),
    };
  }
  return cachedClient.client;
}
