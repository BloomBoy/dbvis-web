import React, { useMemo } from 'react';
import {
  LayoutList,
  LayoutListEntryProps,
} from 'src/components/contentful/Layout';
import { SafeValue } from 'src/utils/contentful';
import { getProductIndex } from 'src/utils/contentful/content/release';
import { WithLayoutData } from 'src/utils/types';
import {
  ColumnData,
  ColumnLayoutData,
} from 'src/components/contentful/Layout/layouts/ColumnLayout';
import { patchStaticProps } from 'src/utils/patchStaticProps';
import { savedLayoutListToProps } from 'src/utils/contentful/parseLayout';
// import EmailSignupForm from 'src/components/contentful/Component/components/emailSignupForm';

type ReleaseNotesPageProps = {
  layouts: LayoutListEntryProps[];
};

export default function ReleaseNotesPage({
  layouts,
}: ReleaseNotesPageProps): JSX.Element {
  const titleLayout = useMemo<
    SafeValue<LayoutListEntryProps<ColumnLayoutData, ColumnData>>
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
      mainHeaderIndex: 0,
    };
  }, []);
  return <LayoutList layouts={[titleLayout, ...layouts]} />;
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
        layouts: await savedLayoutListToProps(
          productIndex.fields.changelogIndexLayout,
          collectedData,
          preview,
          pageContext,
          1,
        ),
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
