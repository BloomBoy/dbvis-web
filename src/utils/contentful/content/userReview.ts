import getClient from 'src/utils/getContentfulClient.mjs';
import {
  ContentTypeFieldsMap,
  GetPaginatedParams,
  GetEntryByIdParams,
  GetTaggedParams,
  SafeEntryFields,
} from '../types';
import { safeValue } from '../helpers';
import { isNonNull } from '../../filters';
import verifyContentfulResult from '../verifyContentfulResult';

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
  rawReview: SafeEntryFields.Entry<ContentTypeFieldsMap['userReview']>,
  preview: boolean | null | undefined,
) {
  const verifiedReview = verifyContentfulResult(
    'userReview',
    rawReview,
    preview,
  );
  if (verifiedReview == null) return null;
  return {
    ...verifiedReview,
    fields: safeValue(rawReview.fields),
  };
}

export async function getUserReview(params: GetEntryByIdParams) {
  const query = getSingleUserReviewQuery(params);
  const rawUserReview = await getClient(params.preview).getEntry<
    ContentTypeFieldsMap['userReview']
  >(params.id, query);
  return rawUserReview && parseUserReview(rawUserReview, params.preview);
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
    .map((entry) => parseUserReview(entry, params.preview))
    .filter(isNonNull);
  return {
    userReviews,
    limit,
    skip,
    total,
  };
}
