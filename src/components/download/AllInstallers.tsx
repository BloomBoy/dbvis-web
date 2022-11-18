import { Tab } from '@headlessui/react';
import { useMemo } from 'react';
import {
  archMap,
  KnownOS,
  knownOsNameMap,
} from 'src/utils/deviceSystemConstants';
import { objectEntries } from 'src/utils/objects';
import MaybeLink from '../contentful/MaybeLink';
import OSIcon, { hasOSIcon } from '../Icon';

export type InstallerTypeProp = {
  type: KnownOS;
  arch?: string;
  note?: string;
  files: {
    size: string;
    sizeInBytes?: number;
    type: string;
    jre?: boolean;
    recommended?: boolean;
    md5Sum?: string;
    sha256Sum?: string;
    bundledJre?: string;
    filename: string;
  }[];
};

type MappedInstaller = {
  [key in keyof (InstallerTypeProp['files'][number] &
    Pick<
      InstallerTypeProp,
      'arch' | 'note'
    >)]: (InstallerTypeProp['files'][number] &
    Pick<InstallerTypeProp, 'arch' | 'note'>)[key];
};

export default function AllInstallers({
  releaseVersion,
  data,
}: {
  releaseVersion: string;
  data: InstallerTypeProp[];
}): JSX.Element {
  const osEntries = useMemo(() => {
    const ret: {
      [key in KnownOS]?: MappedInstaller[];
    } = {};
    data.forEach((os) => {
      const installerArr = ret[os.type] ?? [];
      ret[os.type] = installerArr;
      installerArr.push(
        ...os.files.map((file) => ({
          ...file,
          arch: os.arch,
          note: os.note,
        })),
      );
    });
    return objectEntries(ret).filter(
      (e): e is [typeof e[0], NonNullable<typeof e[1]>] =>
        e[1] != null && e[1].length > 0,
    );
  }, [data]);

  return (
    <>
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-6`}
      >
        All Installers - {releaseVersion}
      </h3>
      <Tab.Group>
        <Tab.List>
          {osEntries.map(([osType]) => (
            <Tab
              key={osType}
              className="text-base md:text-xl font-mono py-2 my-8 mr-4 ui-not-selected:text-primary ui-selected:text-black ui-selected:underline underline-offset-8"
            >
              {knownOsNameMap[osType]}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full border-b border-dashed pb-10">
          {osEntries.map(([osType, files]) => (
            <Tab.Panel
              key={osType}
              className="flex flex-wrap flex-col md:flex-row -mx-4 gap-y-8 w-full"
            >
              {files.map((file) => (
                <div
                  className="px-4 w-full md:w-1/2"
                  key={`${file.type}-${file.arch}-${file.filename}`}
                >
                  <div
                    className="flex flex-row gap-4 items-center justify-between w-full bg-grey-300 rounded-lg p-4 font-mono"
                    style={{
                      boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {hasOSIcon(osType) && (
                      <OSIcon
                        os={osType}
                        style={{ padding: '0px' }}
                        size={30}
                      />
                    )}
                    <div>
                      {knownOsNameMap[osType]}
                      {file.arch != null ? ` ${archMap[file.arch]}` : null}
                    </div>
                    <div className="text-grey-500 uppercase">
                      {file.type}
                      {file.jre != null &&
                        (file.jre === true ? ' with Java' : ' without Java')}
                    </div>
                    <MaybeLink
                      href={`https://dbvis.com/product_download/dbvis-${releaseVersion}/media/${file.filename}`}
                      className="text-primary hover:text-primary-700 underline flex-grow-0 flex-shrink-0 basis-auto ml-auto"
                    >
                      Download ↓
                    </MaybeLink>
                  </div>
                </div>
              ))}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
