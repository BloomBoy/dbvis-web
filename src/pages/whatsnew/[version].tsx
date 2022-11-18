import { GetStaticPathsResult } from 'next';
import React, { useMemo } from 'react';
import LayoutList, {
  WhatsNewLayoutList,
} from 'src/components/contentful/Layout/LayoutList';
import {
  getFeatureVersionById,
  getProductIndex,
  LATEST,
} from 'src/utils/contentful/content/release';
import { WithLayoutData } from 'src/utils/types';
import { Link } from 'react-scroll';
import { SavedLayoutListEntry } from 'src/components/contentful/Layout';
import { useHeaderEntries } from 'src/components/contentful/Layout/helpers';
import { isNonNull } from 'src/utils/filters';
import { patchStaticProps } from 'src/utils/patchStaticProps';

type ReleaseNotesPageProps = {
  layouts: SavedLayoutListEntry[];
};

export default function ReleaseNotesPage({
  layouts,
}: ReleaseNotesPageProps): JSX.Element {
  const headers = useHeaderEntries(layouts);
  const mappedTitles = useMemo(() => {
    return headers
      .map((header) => {
        if (header.linkText) {
          return {
            title: header.linkText,
            id: header.id,
          };
        }
        if (header.subTitle) {
          return {
            title: header.subTitle,
            id: header.id,
          };
        }
        if (header.mainTitle) {
          return {
            title: header.mainTitle,
            id: header.id,
          };
        }
        return null;
      })
      .filter(isNonNull);
  }, [headers]);
  if (mappedTitles.length === 0) {
    return <LayoutList layouts={layouts} />;
  }
  return (
    <div className="flex flex-row w-screen relative">
      <div className="hidden lg:block fixed w-80 h-full">
        <div className="p-10 flex flex-col items-end">
          <ul>
            {mappedTitles.map(({ title, id }) => (
              <li key={title} className="cursor-pointer">
                <Link
                  type="button"
                  to={id}
                  className="text-grey font-mono uppercase py-1 hover:text-primary"
                  offset={-64}
                  smooth
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:ml-80 border-l border-dotted border-[#dddddd]">
        <WhatsNewLayoutList layouts={layouts} />
      </div>
    </div>
  );
}

export const getStaticProps = patchStaticProps<
  WithLayoutData<ReleaseNotesPageProps>
>(async (ctx) => {
  const preview = ctx.preview || false;
  const productIndexSlug =
    (Array.isArray(ctx.params?.productIndex)
      ? ctx.params?.productIndex.join()
      : ctx.params?.productIndex) ?? '/';
  const featureVersionSlug =
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
        pickFields: [],
        featureVersion: featureVersionSlug,
      },
    );
    const featureVersionId = pageContext?.featureVersion?.sys?.id;
    if (productIndex == null || featureVersionId == null) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    const { featureVersion } = await getFeatureVersionById(featureVersionId, {
      preview,
      collectedData,
      pageContext,
      pickFields: [
        'whatsNewLayout',
        'whatsNewAssetReferences',
        'whatsNewEntryReferences',
      ],
    });
    if (featureVersion == null) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    return {
      props: {
        layouts: featureVersion.fields.whatsNewLayout,
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
