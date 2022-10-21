import { GetBaseEntryParams, UserReview } from './types';

import getClient from '../getContentfulClient.mjs';
import { safeValue } from './helpers';

export type UserReviewsQueryParams = {
  source: string;
};

const getUserReviewsQuery = (
  params: UserReviewsQueryParams & Omit<GetBaseEntryParams, 'slug'>,
) => ({
  limit: 20,
  include: 1,
  locale: params.locale,
  content_type: 'userReview',
  order: 'fields.weight',
});

export async function getUserReviews(
  params: UserReviewsQueryParams & Omit<GetBaseEntryParams, 'slug'>,
) {
  const query = getUserReviewsQuery(params);
  const { items } = await getClient(params.preview).getEntries<UserReview>(
    query,
  );
  return items.map((item) => ({
    ...item,
    fields: safeValue(item.fields),
  }));
}
