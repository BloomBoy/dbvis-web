import React, { useMemo } from 'react';
import { LayoutList, SavedLayout } from 'src/components/contentful/Layout';
import { ContentTypeFieldsMap, SafeValue } from 'src/utils/contentful';
import { getProductIndex } from 'src/utils/contentful/content/release';
import { WithLayoutData } from 'src/utils/types';
import {
  ColumnData,
  ColumnLayoutData,
} from 'src/components/contentful/Layout/layouts/ColumnLayout';
import { patchStaticProps } from 'src/utils/patchStaticProps';
// import EmailSignupForm from 'src/components/contentful/Component/components/emailSignupForm';

type ReleaseNotesPageProps = {
  productIndex: SafeValue<
    Pick<
      ContentTypeFieldsMap['productIndex'],
      | 'slug'
      | 'changelogIndexLayout'
      | 'changelogIndexAssetReferences'
      | 'changelogIndexEntryReferences'
      | 'active'
    >
  >;
};

export default function ReleaseNotesPage({
  productIndex,
}: ReleaseNotesPageProps): JSX.Element {
  const titleLayout = useMemo<
    SafeValue<SavedLayout<ColumnLayoutData, ColumnData>>
  >(() => {
    return {
      id: 'injected-titleLayout',
      data: {
        subTitle: 'All Versions list',
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
    <LayoutList layouts={[titleLayout, ...productIndex.changelogIndexLayout]} />
  );
}

export const getStaticProps = patchStaticProps<
  WithLayoutData<ReleaseNotesPageProps>
>(async (ctx) => {
  const preview = ctx.preview || false;
  const productIndexSlug =
    (Array.isArray(ctx.params?.productIndexSlug)
      ? ctx.params?.productIndexSlug.join()
      : ctx.params?.productIndexSlug) ?? '/';
  try {
    const { productIndex, collectedData, pageContext } = await getProductIndex(
      {
        slug: productIndexSlug,
        locale: ctx.locale,
        preview,
      },
      {
        pickFields: [
          'changelogIndexLayout',
          'changelogIndexAssetReferences',
          'changelogIndexEntryReferences',
        ] as const,
      },
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
        pageContext,
        collectedData,
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
