import type { ComponentProps } from '..';
import React from 'react';
import {
  ContentfulFields,
  SafeEntryFields,
  SafeValue,
  safeValue,
} from 'src/utils/contentful';
import { getUserReviews } from 'src/utils/contentful/userReview';
import getFetchKey from 'src/utils/getFetchKey';
import { useRouter } from 'next/router';
import useCollectedData from 'src/hooks/useCollectedData';

type UserReviewsData = {
  initialCount?: SafeEntryFields.Integer;
  maxCount?: SafeEntryFields.Number;
  onlyTags?: SafeEntryFields.Symbols;
};

type CollectedData = {
  userReviews: SafeValue<(ContentfulFields<'userReview'> & { id: string })[]>;
  hasMore?: boolean;
};

const PAGE_SIZE = 5;

const DEFAULT_INITIAL_COUNT = 5;

function reviewFetchKey(
  {
    data: { initialCount = DEFAULT_INITIAL_COUNT, onlyTags },
    type,
  }: ComponentProps<UserReviewsData>,
  preview: boolean,
) {
  return getFetchKey(type, { preview }, initialCount, onlyTags);
}

function UserReviewsComponent(
  props: ComponentProps<UserReviewsData>,
): JSX.Element | null {
  const { isPreview } = useRouter();
  const key = reviewFetchKey(props, isPreview);
  const data = useCollectedData<CollectedData>(key);
  if (data == null) return null;
  const assetUrl = asset.fields.file.url;
  const assetType = asset.fields.file.contentType;
  if (assetType.startsWith('image/')) {
    return <img src={assetUrl} alt={asset.fields.title} />;
  }
  return null;
}

const userReviews = Object.assign(UserReviewsComponent, {
  registerDataCollector(
    props: ComponentProps<UserReviewsData>,
    preview: boolean,
  ) {
    const {
      data: { initialCount, onlyTags },
    } = props;
    return {
      fetchKey: reviewFetchKey(props, preview),
      async collect(): Promise<CollectedData> {
        const {
          userReviews: items,
          total,
          limit,
          skip,
        } = await getUserReviews({
          count: initialCount ?? DEFAULT_INITIAL_COUNT,
          skip: 0,
          preview,
          tags: onlyTags,
        });
        const hasMore = total > skip + limit;
        return {
          userReviews: safeValue(
            items.map(({ sys: { id }, fields }) => ({ id, ...fields })),
          ),
          hasMore,
        };
      },
    };
  },
});

export default userReviews;
