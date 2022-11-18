import React, { useMemo } from 'react';
import { GetStaticPathsResult } from 'next';
import { getProductIndex, LATEST } from 'src/utils/contentful/content/release';
import { WithLayoutData } from 'src/utils/types';
import { ContentTypeFieldsMap, SafeValue } from 'src/utils/contentful';
import { LayoutList, SavedLayout } from 'src/components/contentful/Layout';
import {
  ColumnLayoutData,
  ColumnData,
} from 'src/components/contentful/Layout/layouts/ColumnLayout';
import { patchStaticProps } from 'src/utils/patchStaticProps';

type DownloadPageProps = {
  layouts: SafeValue<ContentTypeFieldsMap['productIndex']>['downloadLayout'];
  version: string;
  releaseDate: string;
};

export default function DownloadPage({
  layouts,
  version,
  releaseDate,
}: DownloadPageProps): JSX.Element {
  const titleLayout = useMemo<
    SafeValue<SavedLayout<ColumnLayoutData, ColumnData>>
  >(() => {
    return {
      id: 'injected-titleLayout',
      data: {
        subTitle: `${version} was released on ${releaseDate}`,
        title: `Get DbVisualizer ${version}`,
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
  }, [version, releaseDate]);

  return <LayoutList layouts={[titleLayout, ...layouts]} />;
}

export const getStaticProps = patchStaticProps<
  WithLayoutData<DownloadPageProps>
>(async (ctx) => {
  const preview = ctx.preview || false;
  const productIndexSlug =
    (Array.isArray(ctx.params?.productIndex)
      ? ctx.params?.productIndex.join()
      : ctx.params?.productIndex) ?? '/';
  const versionSlug =
    (Array.isArray(ctx.params?.version)
      ? ctx.params?.version.join()
      : ctx.params?.version) ?? LATEST;
  try {
    const { productIndex, collectedData, pageContext } = await getProductIndex(
      {
        slug: productIndexSlug,
        locale: ctx.locale,
        preview,
      },
      {
        pickFields: [
          'downloadLayout',
          'downloadAssetReferences',
          'downloadEntryReferences',
        ] as const,
        featureVersion: versionSlug,
        releaseVersion: LATEST,
      },
    );
    const downloadLayout = productIndex?.fields?.downloadLayout;
    if (
      downloadLayout == null ||
      pageContext.productIndex == null ||
      pageContext.featureVersion == null ||
      pageContext.productRelease == null
    ) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    return {
      props: {
        layouts: downloadLayout,
        collectedData,
        pageContext,
        version: pageContext.productRelease.fields.version,
        releaseDate: pageContext.productRelease.fields.releaseDate,
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
