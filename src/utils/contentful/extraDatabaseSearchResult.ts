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
import contentTypeSchemas from './schemas';

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
  fields,
}: Contentful.Entry<
  Partial<ContentTypeFieldsMap['extraDatabaseSearchResult']>
>): DatabaseListEntry | null {
  const { keywords, title, targetUrl, logo, weight } = fields;
  const verified =
    contentTypeSchemas.extraDatabaseSearchResult.safeParse(fields).success;
  if (
    title == null ||
    targetUrl == null ||
    isLink(logo) ||
    logo == null ||
    !verified
  )
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
