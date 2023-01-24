import type { ComponentProps, SavedComponentProps } from '..';
import {
  ContentfulFields,
  SafeEntryFields,
  SafeValue,
} from 'src/utils/contentful';
import { getReviewSources } from 'src/utils/contentful/content/reviewSource';
import getFetchKey from 'src/utils/getFetchKey';
import useCollectedData from 'src/hooks/useCollectedData';
import { useRouter } from 'next/router';
import ReviewSourceScoreRow from 'src/components/ReviewSourceScoreRow';

type ReviewSourcesData = {
  count: SafeEntryFields.Integer;
};

type CollectedData = (SafeValue<ContentfulFields<'reviewSource'>> & {
  id: string;
})[];

const DEFAULT_COUNT = 5;

function reviewSourceFetchKey(
  { data: { count }, type }: SavedComponentProps<ReviewSourcesData>,
  preview: boolean,
) {
  return getFetchKey(type, { preview }, count);
}

function ReviewSourcescomponent(
  props: ComponentProps<ReviewSourcesData>,
): JSX.Element | null {
  const { isPreview } = useRouter();
  const key = reviewSourceFetchKey(props, isPreview);
  const data = useCollectedData<CollectedData>(key);
  if (data == null) return null;
  return (
    <div>
      {data.map(({ id, ...source }) => (
        <ReviewSourceScoreRow key={id} reviewSource={source} />
      ))}
    </div>
  );
}

const reviewSources = Object.assign(ReviewSourcescomponent, {
  registerDataCollector(
    props: SavedComponentProps<ReviewSourcesData>,
    preview: boolean,
  ) {
    const {
      data: { count },
    } = props;
    return {
      fetchKey: reviewSourceFetchKey(props, preview),
      async collect(): Promise<CollectedData> {
        const { reviewSources: items } = await getReviewSources({
          count: count ?? DEFAULT_COUNT,
          skip: 0,
          preview,
        });
        return items.map(({ sys, fields }) => ({ ...fields, id: sys.id }));
      },
    };
  },
});

export default reviewSources;
