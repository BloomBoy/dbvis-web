import React, { useMemo } from 'react';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { getProductIndex } from 'src/utils/contentful/release';
import { getGlobalData } from 'src/utils/getGlobalData';
import { WithGlobals, WithCollectedData } from 'src/utils/types';
import { SafeValue, ContentTypeFieldsMap } from 'src/utils/contentful';
import { LayoutProps, LayoutList } from 'src/components/contentful/Layout';
import {
  ColumnLayoutData,
  ColumnData,
} from 'src/components/contentful/Layout/layouts/ColumnLayout';

type DownloadPageProps = {
  productIndex: SafeValue<
    Pick<
      ContentTypeFieldsMap['productIndex'],
      | 'slug'
      | 'downloadLayout'
      | 'downloadAssetReferences'
      | 'downloadEntryReferences'
      | 'active'
    >
  >;
};

export default function DownloadPage({
  productIndex,
}: DownloadPageProps): JSX.Element {
  const titleLayout = useMemo<
    SafeValue<LayoutProps<ColumnLayoutData, ColumnData>>
  >(() => {
    return {
      id: 'injected-titleLayout',
      data: {
        subTitle: 'v14.0.0 was released on 2022-09-25',
        title: 'Get DbVisualizer v14.0',
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
  }, []);

  return <LayoutList layouts={[titleLayout, ...productIndex.downloadLayout]} />;
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<
  GetStaticPropsResult<WithGlobals<WithCollectedData<DownloadPageProps>>>
> {
  const preview = ctx.preview || false;
  const productIndexSlug =
    (Array.isArray(ctx.params?.productIndexSlug)
      ? ctx.params?.productIndexSlug.join()
      : ctx.params?.productIndexSlug) ?? '/';
  try {
    const { productIndex, collectedData } = await getProductIndex(
      {
        slug: productIndexSlug,
        locale: ctx.locale,
        preview,
      },
      [
        'slug',
        'downloadLayout',
        'downloadAssetReferences',
        'downloadEntryReferences',
        'active',
      ],
    );
    if (productIndex == null) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    return {
      props: {
        productIndex: productIndex.fields,
        collectedData,
        ...(await getGlobalData(ctx)),
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
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
