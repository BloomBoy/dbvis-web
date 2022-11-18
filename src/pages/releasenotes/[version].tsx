import { GetStaticPathsResult, GetStaticPropsContext } from 'next';
import React, { useMemo } from 'react';
import {
  LayoutList,
  SavedLayout,
  SavedLayoutListEntry,
} from 'src/components/contentful/Layout';
import { SafeValue } from 'src/utils/contentful';
import { getProductIndex } from 'src/utils/contentful/content/release';
import { WithLayoutData } from 'src/utils/types';
import {
  ColumnData,
  ColumnLayoutData,
} from 'src/components/contentful/Layout/layouts/ColumnLayout';
import { patchStaticProps } from 'src/utils/patchStaticProps';

type ReleaseNotesPageProps = {
  layouts: SavedLayoutListEntry[];
  version: string;
  releaseDate: string;
};

export default function ReleaseNotesPage({
  layouts,
  version,
  releaseDate,
}: ReleaseNotesPageProps): JSX.Element {
  const titleLayout = useMemo<
    SafeValue<SavedLayout<ColumnLayoutData, ColumnData>>
  >(() => {
    return {
      id: 'injected-titleLayout',
      data: {
        subTitle: `${version} was released on ${releaseDate}`,
        title: 'Release Notes',
        renderHeader: false,
      },
      type: 'ColumnLayout',
      slots: [
        {
          components: [
            {
              type: 'layoutTitleComponent',
              data: {
                classes: ['text-left'],
              },
              id: 'injected-titleLayout-title',
            },
          ],
          data: {},
          id: 'column-1',
        },
      ],
    };
  }, [releaseDate, version]);
  return <LayoutList layouts={[titleLayout, ...layouts]} />;
}

export const getStaticProps = patchStaticProps<
  WithLayoutData<ReleaseNotesPageProps>
>(async (ctx: GetStaticPropsContext) => {
  const preview = ctx.preview || false;
  const productIndexSlug =
    (Array.isArray(ctx.params?.productIndex)
      ? ctx.params?.productIndex.join()
      : ctx.params?.productIndex) ?? '/';
  const featureVersionSlug =
    (Array.isArray(ctx.params?.version)
      ? ctx.params?.version.join()
      : ctx.params?.version) ?? undefined;
  try {
    const { productIndex, collectedData, pageContext } = await getProductIndex(
      {
        slug: productIndexSlug,
        locale: ctx.locale,
        preview,
      },
      {
        pickFields: [
          'changelogLayout',
          'changelogAssetReferences',
          'changelogEntryReferences',
        ],
        featureVersion: featureVersionSlug,
      },
    );
    if (
      productIndex == null ||
      productIndex.fields.changelogLayout == null ||
      pageContext.featureVersion == null
    ) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    return {
      props: {
        layouts: productIndex.fields.changelogLayout,
        version: pageContext.featureVersion.fields.version,
        releaseDate: pageContext.featureVersion.fields.releaseDate,
        collectedData,
        pageContext,
      },
      revalidate: 12,
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
      revalidate: 12,
    };
  }
});

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
