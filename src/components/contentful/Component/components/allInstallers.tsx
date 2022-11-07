import { useRouter } from 'next/router';
import { OsTypes } from 'react-device-detect';
import AllInstallers from 'src/components/download/AllInstallers';
import useCollectedData from 'src/hooks/useCollectedData';
import getFetchKey from 'src/utils/getFetchKey';
import { ComponentProps, SavedComponentProps } from '..';

type AllInstallersData = {
  a?: unknown;
};

type CollectedData = {
  id: string;
  title: string;
  url: string;
  os: string;
  text: string;
}[];

function installersFetchKey(
  { data: {} }: SavedComponentProps<AllInstallersData>,
  preview: boolean,
) {
  return getFetchKey('installers', { preview });
}

function AllInstallersComponent(props: ComponentProps<AllInstallersData>) {
  const { isPreview } = useRouter();
  const key = installersFetchKey(props, isPreview);
  const installers = useCollectedData<CollectedData>(key, []);
  return (
    <div className="py-5">
      <AllInstallers data={installers} />
    </div>
  );
}

const allInstallers = Object.assign(AllInstallersComponent, {
  registerDataCollector(
    props: SavedComponentProps<AllInstallersData>,
    preview: boolean,
  ) {
    return {
      fetchKey: installersFetchKey(props, preview),
      async collect(): Promise<CollectedData> {
        return [
          {
            id: '1',
            title: 'Windows',
            url: 'a link',
            os: OsTypes.Windows,
            text: 'DMG with Java',
          },
          {
            id: '2',
            title: 'macOS Silicon',
            url: 'a link',
            os: OsTypes.MAC_OS,
            text: 'DMG with Java',
          },
          {
            id: '3',
            title: 'Linux Silicon',
            url: 'a link',
            os: 'Linux',
            text: 'DMG with Java',
          },
          {
            id: '4',
            title: 'macOS Intel',
            url: 'a link',
            os: OsTypes.MAC_OS,
            text: 'DMG with Java',
          },
          {
            id: '5',
            title: 'Windows Silicon',
            url: 'a link',
            os: OsTypes.Windows,
            text: 'DMG with Java',
          },
        ];
      },
    };
  },
});

export default allInstallers;
