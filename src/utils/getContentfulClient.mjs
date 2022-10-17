import contentful from 'contentful';

// Language transformations may statically replace process.env.XXX tokens
// which doesn't work with destructuring.
const CF_SPACE_ID = process.env.CF_SPACE_ID;
const CF_DELIVERY_ACCESS_TOKEN = process.env.CF_DELIVERY_ACCESS_TOKEN;
const CF_PREVIEW_ACCESS_TOKEN = process.env.CF_PREVIEW_ACCESS_TOKEN;

if (!CF_SPACE_ID || !CF_DELIVERY_ACCESS_TOKEN) {
  throw new Error('Missing Contentful environment variables');
}

const baseClient = contentful.createClient({
  space: CF_SPACE_ID,
  accessToken: CF_DELIVERY_ACCESS_TOKEN,
});

const previewClient = contentful.createClient({
  space: CF_SPACE_ID,
  accessToken: CF_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
});

/**
 * Get a contentful client, based on whether we're in preview mode or not.
 * @param {boolean} [preview]
 * @returns {import('contentful').ContentfulClientApi} the client
 */
const getContentfulClient = (preview) => (preview ? previewClient : baseClient);

export default getContentfulClient;
