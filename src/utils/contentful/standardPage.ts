import {
  ContentTypeFieldsMap,
  GetSlugEntryParams,
  SafeEntryFields,
} from './types';
import parseLayout from './parseLayout';
import getClient from '../getContentfulClient.mjs';
import { SafeValue, safeValue } from './helpers';
import { Entry } from 'contentful';

const getStandardPageQuery = (params: GetSlugEntryParams) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'standardPage',
});

async function parseStandardPage(
  rawPage: Entry<ContentTypeFieldsMap['standardPage']>,
) {
  const {
    fields: { pageLayout, ...fields },
  } = rawPage;
  const { collectedData, layoutList } = await parseLayout(rawPage);
  const safeFields = safeValue<typeof fields>(fields);
  return {
    page: {
      ...rawPage,
      fields: {
        ...safeFields,
        pageLayout: layoutList,
      },
    },
    collectedData,
  };
}

export async function getPage(params: GetSlugEntryParams): Promise<{
  page: StandardPageEntry | null;
  collectedData: Record<string, unknown>;
}> {
  const query = getStandardPageQuery(params);
  const { items } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['standardPage']
  >(query);
  const rawPage = items.at(0);
  if (!rawPage) {
    return {
      page: null,
      collectedData: {},
    };
  }
  return parseStandardPage(rawPage);
}

export type StandardPageEntry = SafeEntryFields.Entry<
  SafeValue<ContentTypeFieldsMap['standardPage']>
>;
