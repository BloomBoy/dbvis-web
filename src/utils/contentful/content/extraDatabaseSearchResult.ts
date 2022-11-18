import getClient from 'src/utils/getContentfulClient.mjs';
import { DatabaseListEntry } from 'src/components/ShowDatabases';
import { isNonNull } from 'src/utils/filters';
import {
  ContentTypeFieldsMap,
  GetPaginatedParams,
  GetTaggedParams,
  SafeEntryFields,
} from '../types';
import { isLink } from '../helpers';
import verifyContentfulResult from '../verifyContentfulResult';

export interface GetExtraDatabaseSearchResultsParams
  extends GetPaginatedParams,
    GetTaggedParams {}

const getExtraDatabaseSearchResultsQuery = (params: GetTaggedParams) => ({
  include: 2,
  locale: params.locale,
  ...(params.tags != null
    ? { 'metadata.tags.sys.id[in]': params.tags?.join(',') }
    : null),
  content_type: 'extraDatabaseSearchResult',
  order: 'fields.weight,fields.title',
});

const getPagedExtraDatabaseSearchResultsQuery = (
  params: GetExtraDatabaseSearchResultsParams,
) => ({
  ...getExtraDatabaseSearchResultsQuery(params),
  limit: params.count,
  skip: params.skip,
});

function parseListItem(
  entry: SafeEntryFields.Entry<
    Partial<ContentTypeFieldsMap['extraDatabaseSearchResult']>
  >,
  preview: boolean | null | undefined,
): DatabaseListEntry | null {
  const verifiedEntry = verifyContentfulResult(
    'extraDatabaseSearchResult',
    entry,
    preview,
  );
  if (verifiedEntry == null) return null;
  const {
    sys: { id },
    fields,
  } = verifiedEntry;
  const { keywords, title, targetUrl, logo, weight } = fields;
  if (title == null || targetUrl == null || isLink(logo) || logo == null)
    return null;

  return {
    id,
    title: title,
    keywords: keywords ?? [],
    logo: {
      src: logo.fields.file.url,
      alt: title,
    },
    searchable: true,
    url: targetUrl,
    weight: weight ?? 0,
  };
}

export async function getExtraDatabaseSearchResultEntries(
  params: GetExtraDatabaseSearchResultsParams,
) {
  const query = getPagedExtraDatabaseSearchResultsQuery(params);
  const { items, limit, skip, total } = await getClient(
    params.preview,
  ).getEntries<ContentTypeFieldsMap['extraDatabaseSearchResult']>(query);
  const extradatabaseSearchResultListEntries = items
    .map((entry) => parseListItem(entry, params.preview))
    .filter(isNonNull);
  return {
    extradatabaseSearchResultListEntries,
    limit,
    skip,
    total,
  };
}

export async function getAllExtraDatabaseSearchResultListEntries(
  params: GetTaggedParams,
) {
  const query = {
    ...getExtraDatabaseSearchResultsQuery(params),
    limit: 100,
    skip: 0,
  };
  const items: SafeEntryFields.Entry<
    ContentTypeFieldsMap['extraDatabaseSearchResult']
  >[] = [];
  let total = Infinity;
  do {
    let newItems;
    ({
      items: newItems,
      skip: query.skip,
      total,
    } = await getClient(params.preview).getEntries<
      ContentTypeFieldsMap['extraDatabaseSearchResult']
    >(query));
    if (newItems.length === 0) break;
    query.skip += newItems.length;
    items.push(...newItems);
  } while (items.length < total);
  const extradatabaseSearchResultListEntries = items
    .map((entry) => parseListItem(entry, params.preview))
    .filter(isNonNull);
  return extradatabaseSearchResultListEntries;
}
