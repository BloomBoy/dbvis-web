import type { ComponentProps } from '..';
import React, { useCallback, useEffect } from 'react';
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
  hasMore: boolean;
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
  const collectedData = useCollectedData<CollectedData>(key);
  const skipRef = React.useRef(collectedData?.userReviews.length ?? 0);
  const totalRef = React.useRef(
    collectedData?.hasMore ?? false
      ? Infinity
      : collectedData?.userReviews?.length ?? 0,
  );
  const [reviews, setReviews] = React.useState(
    collectedData?.userReviews ?? [],
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const isLoadingRef = React.useRef(false);
  const hasMore =
    reviews.length < totalRef.current &&
    reviews.length < (props.data.maxCount ?? Infinity);
  useEffect(() => {
    if (collectedData == null) return;
    setReviews(collectedData.userReviews);
    totalRef.current =
      collectedData?.hasMore ?? false
        ? Infinity
        : collectedData?.userReviews?.length ?? 0;
    skipRef.current = collectedData.userReviews.length;
  }, [collectedData, props.data.initialCount]);
  const loadNextPage = useCallback(() => {
    if (isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    getUserReviews({
      skip: skipRef.current,
      count: PAGE_SIZE,
      tags: props.data.onlyTags,
    })
      .then((result) => {
        skipRef.current += result.skip + result.userReviews.length;
        totalRef.current = result.total;
        setReviews((prev) => [
          ...prev,
          ...result.userReviews
            .filter(({ sys: { id } }) =>
              prev.every(({ id: existingId }) => existingId !== id),
            )
            .map(({ sys: { id }, fields }) => ({ id, ...fields })),
        ]);
      })
      .catch(console.error)
      .finally(() => {
        isLoadingRef.current = false;
        setIsLoading(false);
      });
  }, [hasMore, props.data.onlyTags]);
  if (reviews.length === 0) return null;
  return (
    <div>
      {reviews.map(({ id, ...review }) => (
        <div key={id}>
          RENDER REVIEW BY {review.firstName} {review.lastName} HERE{' '}
        </div>
      ))}
      <button onClick={loadNextPage} disabled={isLoading || !hasMore}>
        LOAD MORE
      </button>
    </div>
  );
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
