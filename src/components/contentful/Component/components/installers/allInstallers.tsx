import { useRouter } from 'next/router';
import AllInstallers from 'src/components/download/AllInstallers';
import useCollectedData from 'src/hooks/useCollectedData';
import type { ComponentProps } from 'src/components/contentful/Component';
import {
  CollectedData,
  downloadsFetchKey,
  registerDataCollector,
} from './shared';
import usePageContext from 'src/hooks/usePageContex';

type AllInstallersData = {
  a?: unknown;
};

function AllInstallersComponent(props: ComponentProps<AllInstallersData>) {
  const { isPreview } = useRouter();
  const pageContext = usePageContext();
  const key = downloadsFetchKey(props, pageContext, isPreview);
  const collectedData = useCollectedData<CollectedData>(key);
  if (collectedData == null) return null;
  const { version, download } = collectedData;
  return (
    <div className="py-5">
      <AllInstallers data={download.installers} releaseVersion={version} />
    </div>
  );
}

const allInstallers = Object.assign(AllInstallersComponent, {
  registerDataCollector,
});

export default allInstallers;
