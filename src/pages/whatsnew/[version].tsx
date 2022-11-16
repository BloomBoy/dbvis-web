import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import React from 'react';
import { WhatsNewLayoutList } from 'src/components/contentful/Layout/LayoutList';
import { ContentTypeFieldsMap, SafeValue } from 'src/utils/contentful';
import { getFeatureVersion } from 'src/utils/contentful/release';
import { getGlobalData } from 'src/utils/getGlobalData';
import { WithGlobals, WithCollectedData } from 'src/utils/types';
import { Link } from 'react-scroll';

type ReleaseNotesPageProps = {
  featureVersion: SafeValue<
    Pick<
      ContentTypeFieldsMap['featureVersion'],
      | 'version'
      | 'whatsNewLayout'
      | 'whatsNewAssetReferences'
      | 'whatsNewEntryReferences'
    >
  >;
};

const content = [
  { title: 'Welcome', id: 'brjovjyu' },
  { title: "What's new in 13.0", id: 'buv5zx9y' },
  { title: 'Support for four new data sources.', id: 'lfd780cj' },
  { title: '... and more', id: 'knjvierh' },
] as const;

export default function ReleaseNotesPage({
  featureVersion,
}: ReleaseNotesPageProps): JSX.Element {
  return (
    <div className="flex flex-row w-screen overflow-hidden relative">
      <div className="hidden lg:block fixed w-80 h-full">
        <div className="p-10 flex flex-col items-end">
          <ul>
            {content.map(({ title, id }) => (
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
        <WhatsNewLayoutList layouts={featureVersion.whatsNewLayout} />
      </div>
    </div>
  );
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<
  GetStaticPropsResult<WithGlobals<WithCollectedData<ReleaseNotesPageProps>>>
> {
  const preview = ctx.preview || false;
  const featureVersionSlug =
    (Array.isArray(ctx.params?.version)
      ? ctx.params?.version.join()
      : ctx.params?.version) ?? '/';
  try {
    const { featureVersion, collectedData } = await getFeatureVersion(
      {
        version: featureVersionSlug,
        locale: ctx.locale,
        preview,
      },
      [
        'version',
        'whatsNewLayout',
        'whatsNewAssetReferences',
        'whatsNewEntryReferences',
      ],
    );
    if (featureVersion == null) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    return {
      props: {
        featureVersion: featureVersion.fields,
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
