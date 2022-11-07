import { useRouter } from 'next/router';
import { OsTypes } from 'react-device-detect';
import InstallationInstructions from 'src/components/download/InstallationInstructions';
import useCollectedData from 'src/hooks/useCollectedData';
import getFetchKey from 'src/utils/getFetchKey';
import { ComponentProps, SavedComponentProps } from '..';

type InstallationInstructionsData = {
  a?: unknown;
};

type CollectedData = {
  id: string;
  title: string;
  os: string;
  text: string;
}[];

function installersFetchKey(
  { data: {} }: SavedComponentProps<InstallationInstructionsData>,
  preview: boolean,
) {
  return getFetchKey('installers', { preview });
}

function InstallationInstructionsComponent(
  props: ComponentProps<InstallationInstructionsData>,
) {
  const { isPreview } = useRouter();
  const key = installersFetchKey(props, isPreview);
  const installers = useCollectedData<CollectedData>(key, []);
  return (
    <div className="py-5">
      <InstallationInstructions data={installers} />
    </div>
  );
}

const installationInstructions = Object.assign(
  InstallationInstructionsComponent,
  {
    registerDataCollector(
      props: SavedComponentProps<InstallationInstructionsData>,
      preview: boolean,
    ) {
      return {
        fetchKey: installersFetchKey(props, preview),
        async collect(): Promise<CollectedData> {
          return [
            {
              id: '1',
              os: OsTypes.MAC_OS,
              title: 'FROM TGZ-archives',
              text: `All Files are contained in an enclosing folder named DbVisualizer Unpack the tgz file in a terminal window with the following command or double-click it in the Finder: open dbvis_macos_<version>.tgz Start DbVisualizer by opening the following: DbVisualizer`,
            },
            {
              id: '2',
              os: OsTypes.Windows,
              title: 'FROM ZIP-archives',
              text: `All Files are contained in an enclosing folder named DbVisualizer Unpack the tgz file in a terminal window with the following command or double-click it in the Finder: open dbvis_macos_<version>.tgz Start DbVisualizer by opening the following: DbVisualizer`,
            },
            {
              id: '3',
              os: 'Linux',
              title: 'FROM TAR-archives',
              text: 'All Files are contained in an enclosing folder named DbVisualizer Unpack the tgz file in a terminal window with the following command or double-click it in the Finder: open dbvis_macos_<version>.tgz Start DbVisualizer by opening the following: DbVisualizer',
            },
          ];
        },
      };
    },
  },
);

export default installationInstructions;
