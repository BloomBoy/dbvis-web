import { useRouter } from 'next/router';
import RecommendedInstallers from 'src/components/download/RecommendedInstallers';
import useCollectedData from 'src/hooks/useCollectedData';
import type { ComponentProps } from 'src/components/contentful/Component';
import {
  CollectedData,
  downloadsFetchKey,
  registerDataCollector,
} from './shared';
import usePageContext from 'src/hooks/usePageContex';

// eslint-disable-next-line @typescript-eslint/ban-types
type RecommendedInstallersData = {};

function RecommendedInstallersComponent(
  props: ComponentProps<RecommendedInstallersData>,
) {
  const pageContext = usePageContext();
  const { isPreview } = useRouter();
  const key = downloadsFetchKey(props, pageContext, isPreview);
  const collectedData = useCollectedData<CollectedData>(key);
  if (collectedData == null) return null;
  const { download, version } = collectedData;
  return (
    <div className="py-5">
      <RecommendedInstallers
        data={download.installers}
        releaseVersion={version}
      />
    </div>
  );
}

const recommendedInstallers = Object.assign(RecommendedInstallersComponent, {
  registerDataCollector,
});

export default recommendedInstallers;
