import * as Contentful from 'contentful';
import {
  ContentTypeFieldsMap,
  GetPaginatedParams,
  GetTaggedParams,
} from './types';
import getClient from '../getContentfulClient.mjs';
import { isLink } from './helpers';
import { DatabaseListEntry } from 'src/components/ShowDatabases';
import { isNonNull } from '../filters';

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

function parseListItem({
  sys: { id },
  fields: { keywords, title, targetUrl, logo, weight },
}: Contentful.Entry<
  Partial<ContentTypeFieldsMap['extraDatabaseSearchResult']>
>): DatabaseListEntry | null {
  if (title == null) return null;
  if (targetUrl == null) return null;
  if (isLink(logo) || logo == null) return null;
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
    .map(parseListItem)
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
  const items: Contentful.Entry<
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
    .map(parseListItem)
    .filter(isNonNull);
  return extradatabaseSearchResultListEntries;
}
