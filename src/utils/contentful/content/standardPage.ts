import getClient from 'src/utils/getContentfulClient.mjs';
import {
  ContentTypeFieldsMap,
  GetSlugEntryParams,
  SafeEntryFields,
} from '../types';
import parseLayout from '../parseLayout';
import { SafeValue, safeValue } from '../helpers';
import verifyContentfulResult from '../verifyContentfulResult';

const getStandardPageQuery = (params: GetSlugEntryParams) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'standardPage',
});

async function parseStandardPage(
  preview: boolean,
  rawPage: SafeEntryFields.Entry<ContentTypeFieldsMap['standardPage']>,
) {
  const {
    fields: { pageLayout, ...fields },
  } = rawPage;
  const { collectedData, layoutList } = await parseLayout(preview, rawPage);
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
  page: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['standardPage']>
  > | null;
  collectedData: Record<string, unknown>;
}> {
  const query = getStandardPageQuery(params);
  const { items } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['standardPage']
  >(query);
  const rawPage = items.at(0);
  const verifiedPage =
    rawPage && verifyContentfulResult('standardPage', rawPage, params.preview);
  if (!verifiedPage) {
    return {
      page: null,
      collectedData: {},
    };
  }
  return parseStandardPage(params.preview ?? false, verifiedPage);
}
