import classNames from 'classnames';
import { useRouter } from 'next/router';
import RichText from 'src/components/RichText';
import useCollectedData from 'src/hooks/useCollectedData';
import type { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from 'src/components/contentful/Component';
import {
  CollectedData,
  downloadsFetchKey,
  registerDataCollector,
} from './shared';
import usePageContext from 'src/hooks/usePageContex';

type RecommendedInstallersData = {
  text?: SafeEntryFields.RichText;
  classes: SafeEntryFields.Symbol[];
};

function SystemRequirementsComponent(
  props: ComponentProps<RecommendedInstallersData>,
) {
  const { isPreview } = useRouter();
  const pageContext = usePageContext();
  const key = downloadsFetchKey(props, pageContext, isPreview);
  const collectedData = useCollectedData<CollectedData>(key);
  const reqs = collectedData?.download.reqs;
  if (props.data.text) {
    return (
      <div className="pb-12">
        <RichText
          content={props.data.text}
          className={classNames(...(props.data?.classes || []))}
        />
      </div>
    );
  }
  if (reqs == null) {
    return null;
  }
  return (
    <div className="pb-12">
      <div
        className={classNames('prose', ...(props.data?.classes || []))}
        dangerouslySetInnerHTML={{ __html: reqs }}
      />
    </div>
  );
}

const systemRequirements = Object.assign(SystemRequirementsComponent, {
  registerDataCollector,
});

export default systemRequirements;
