import * as Contentful from 'contentful';
import {
  ContentTypeFieldsMap,
  GetPaginatedParams,
  GetEntryByIdParams,
  GetTaggedParams,
} from './types';
import getClient from '../getContentfulClient.mjs';
import { safeValue } from './helpers';
import contentTypeSchemas from './schemas';

export interface GetUserReviewsParams
  extends GetPaginatedParams,
    GetTaggedParams {
  source?: string;
}

const getSingleUserReviewQuery = (params: GetEntryByIdParams) => ({
  limit: 1,
  include: 2,
  locale: params.locale,
  content_type: 'userReview',
  order: 'fields.weight',
});

function parseUserReview(
  rawReview: Contentful.Entry<ContentTypeFieldsMap['userReview']>,
) {
  return {
    ...rawReview,
    fields: safeValue(rawReview.fields),
  };
}

export async function getUserReview(params: GetEntryByIdParams) {
  const query = getSingleUserReviewQuery(params);
  const rawUserReview = await getClient(params.preview).getEntry<
    ContentTypeFieldsMap['userReview']
  >(params.id, query);
  if (!rawUserReview) return null;
  return parseUserReview(rawUserReview);
}

const getUserReviewsQuery = (params: GetUserReviewsParams) => ({
  limit: params.count,
  skip: params.skip,
  include: 2,
  locale: params.locale,
  ...(params.tags != null
    ? { 'metadata.tags.sys.id[in]': params.tags?.join(',') }
    : null),
  content_type: 'userReview',
});

export async function getUserReviews(params: GetUserReviewsParams) {
  const query = getUserReviewsQuery(params);
  const { items, limit, skip, total } = await getClient(
    params.preview,
  ).getEntries<ContentTypeFieldsMap['userReview']>(query);
  const userReviews = items
    .filter((item) => {
      return contentTypeSchemas.userReview.safeParse(item.fields).success;
    })
    .map(parseUserReview);
  return {
    userReviews,
    limit,
    skip,
    total,
  };
}
