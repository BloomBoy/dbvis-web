import {
  ContentTypeFieldsMap,
  GetPaginatedParams,
  GetEntryByIdParams,
  GetTaggedParams,
  SafeEntryFields,
} from './types';
import getClient from '../getContentfulClient.mjs';
import { safeValue } from './helpers';
import contentTypeSchemas from './schemas';

export interface GetReviewSourcesParams
  extends GetPaginatedParams,
    GetTaggedParams {}

const getSingleReviewSourceQuery = (params: GetEntryByIdParams) => ({
  limit: 1,
  include: 2,
  locale: params.locale,
  content_type: 'reviewSource',
  order: 'fields.weight',
});

function parseReviewSource(
  rawSource: SafeEntryFields.Entry<ContentTypeFieldsMap['reviewSource']>,
) {
  return {
    ...rawSource,
    fields: safeValue(rawSource.fields),
  };
}

export async function getReviewSource(params: GetEntryByIdParams) {
  const query = getSingleReviewSourceQuery(params);
  const rawSource = await getClient(params.preview).getEntry<
    ContentTypeFieldsMap['reviewSource']
  >(params.id, query);
  const verified = contentTypeSchemas.reviewSource.safeParse(
    rawSource?.fields,
  ).success;
  if (!rawSource || !verified) return null;
  return parseReviewSource(rawSource);
}

const getReviewSourcesQuery = (params: GetReviewSourcesParams) => ({
  limit: params.count,
  skip: params.skip,
  include: 2,
  locale: params.locale,
  ...(params.tags != null
    ? { 'metadata.tags.sys.id[in]': params.tags?.join(',') }
    : null),
  content_type: 'reviewSource',
});

export async function getReviewSources(params: GetReviewSourcesParams) {
  const query = getReviewSourcesQuery(params);
  const { items, limit, skip, total } = await getClient(
    params.preview,
  ).getEntries<ContentTypeFieldsMap['reviewSource']>(query);
  const reviewSources = items
    .filter((item) => {
      return contentTypeSchemas.reviewSource.safeParse(item?.fields).success;
    })
    .map(parseReviewSource);
  return {
    reviewSources,
    fetched: items.length,
    limit,
    skip,
    total,
  };
}
