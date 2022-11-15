import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import React, { useMemo } from 'react';
import { LayoutList, LayoutProps } from 'src/components/contentful/Layout';
import { ContentTypeFieldsMap, SafeValue } from 'src/utils/contentful';
import { getProductIndex } from 'src/utils/contentful/release';
import { getGlobalData } from 'src/utils/getGlobalData';
import { WithGlobals, WithCollectedData } from 'src/utils/types';
import {
  ColumnData,
  ColumnLayoutData,
} from 'src/components/contentful/Layout/layouts/ColumnLayout';
// import EmailSignupForm from 'src/components/contentful/Component/components/emailSignupForm';

type ReleaseNotesPageProps = {
  productIndex: SafeValue<
    Pick<
      ContentTypeFieldsMap['productIndex'],
      | 'slug'
      | 'changelogLayout'
      | 'changelogAssetReferences'
      | 'changelogEntryReferences'
      | 'active'
    >
  >;
};

export default function ReleaseNotesPage({
  productIndex,
}: ReleaseNotesPageProps): JSX.Element {
  const titleLayout = useMemo<
    SafeValue<LayoutProps<ColumnLayoutData, ColumnData>>
  >(() => {
    return {
      id: 'injected-titleLayout',
      data: {
        subTitle: 'All Version Quick Links',
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
  }, []);
  return (
    <LayoutList layouts={[titleLayout, ...productIndex.changelogLayout]} />
  );
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<
  GetStaticPropsResult<WithGlobals<WithCollectedData<ReleaseNotesPageProps>>>
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
        'changelogLayout',
        'changelogAssetReferences',
        'changelogEntryReferences',
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
