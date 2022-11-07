import React from 'react';
import RecommendedInstallers from 'src/components/download/RecommendedInstallers';
import AllInstallers from 'src/components/download/AllInstallers';
import InstallationInstructions from 'src/components/download/InstallationInstructions';
import { OsTypes } from 'react-device-detect';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { getProductIndex } from 'src/utils/contentful/release';
import { getGlobalData } from 'src/utils/getGlobalData';
import { WithGlobals, WithCollectedData } from 'src/utils/types';
import { SafeValue, ContentTypeFieldsMap } from 'src/utils/contentful';

const installers = [
  {
    id: 1,
    title: 'Windows',
    url: 'a link',
    os: OsTypes.Windows,
    text: 'DMG with Java',
  },
  {
    id: 2,
    title: 'macOS Silicon',
    url: 'a link',
    os: OsTypes.MAC_OS,
    text: 'DMG with Java',
  },
  {
    id: 3,
    title: 'Linux Silicon',
    url: 'a link',
    os: 'Linux',
    text: 'DMG with Java',
  },
  {
    id: 4,
    title: 'macOS Intel',
    url: 'a link',
    os: OsTypes.MAC_OS,
    text: 'DMG with Java',
  },
  {
    id: 5,
    title: 'Windows Silicon',
    url: 'a link',
    os: OsTypes.Windows,
    text: 'DMG with Java',
  },
];

type DownloadPageProps = {
  productIndex: SafeValue<
    Pick<
      ContentTypeFieldsMap['productIndex'],
      'slug' | 'downloadLayout' | 'active'
    >
  >;
};

export default function DownloadPage(): JSX.Element {
  const instructions = [
    {
      id: 1,
      os: OsTypes.MAC_OS,
      title: 'FROM TGZ-archives',
      text: `All Files are contained in an enclosing folder named DbVisualizer Unpack the tgz file in a terminal window with the following command or double-click it in the Finder: open dbvis_macos_<version>.tgz Start DbVisualizer by opening the following: DbVisualizer`,
    },
    {
      id: 2,
      os: OsTypes.Windows,
      title: 'FROM ZIP-archives',
      text: `All Files are contained in an enclosing folder named DbVisualizer Unpack the tgz file in a terminal window with the following command or double-click it in the Finder: open dbvis_macos_<version>.tgz Start DbVisualizer by opening the following: DbVisualizer`,
    },
    {
      id: 3,
      os: 'Linux',
      title: 'FROM TAR-archives',
      text: 'All Files are contained in an enclosing folder named DbVisualizer Unpack the tgz file in a terminal window with the following command or double-click it in the Finder: open dbvis_macos_<version>.tgz Start DbVisualizer by opening the following: DbVisualizer',
    },
  ];
  const requirements = `OS Support: Windows 64-bit 11/10/8/7 Linux macOS 10.11+ Windows 64-bit: Java 17 is required macOS: Java 17 is required Linux: Java 17 is required The free Eclipse Temurin ↗ Java Runtime is bundled with installers marked With Java VM.Known Java issues for Windows, Linux, macOS users ↗ `;

  return (
    <>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <h1>Download</h1>
      </div>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <h3>Quick Links</h3>
      </div>
      <div className="mx-auto p-8 pb-0 rounded-3xl max-w-7xl">
        <RecommendedInstallers data={installers} />
        <hr className="border-dashed border-grey-500 mt-16 opacity-20" />
      </div>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <AllInstallers data={installers} />
        <hr className="border-dashed border-grey-500 mt-16 opacity-20" />
      </div>
      <div
        className="width-full"
        style={{ backgroundColor: 'rgb(43, 43, 43)' }}
      >
        <div className="mx-auto my-16 p-8 rounded-3xl max-w-7xl">
          <InstallationInstructions data={instructions} text={requirements} />
        </div>
      </div>
    </>
  );
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
      ['slug', 'downloadLayout', 'active'],
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
