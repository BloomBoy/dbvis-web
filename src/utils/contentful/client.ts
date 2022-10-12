import { createClient } from 'contentful';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export type GetBaseEntryParams = {
  slug: string;
  locale?: string;
  preview?: boolean;
};

const CF_SPACE_ID = serverRuntimeConfig.CF_SPACE_ID;
const CF_DELIVERY_ACCESS_TOKEN = serverRuntimeConfig.CF_DELIVERY_ACCESS_TOKEN;
const CF_PREVIEW_ACCESS_TOKEN = serverRuntimeConfig.CF_PREVIEW_ACCESS_TOKEN;

if (!CF_SPACE_ID) {
  throw new Error('CF_SPACE_ID is not defined');
}

if (!CF_DELIVERY_ACCESS_TOKEN) {
  throw new Error('CF_DELIVERY_ACCESS_TOKEN is not defined');
}

if (!CF_PREVIEW_ACCESS_TOKEN) {
  throw new Error('CF_PREVIEW_ACCESS_TOKEN is not defined');
}

const baseClient = createClient({
  space: CF_SPACE_ID,
  accessToken: CF_DELIVERY_ACCESS_TOKEN,
});

const previewClient = createClient({
  space: CF_SPACE_ID,
  accessToken: CF_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
});

export const getClient = (preview?: boolean) =>
  preview ? previewClient : baseClient;
