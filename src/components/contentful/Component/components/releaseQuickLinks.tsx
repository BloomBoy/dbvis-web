import MaybeLink from 'src/components/contentful/MaybeLink';
import getFetchKey from 'src/utils/getFetchKey';
import { SavedComponentProps } from '..';

type ReleaseQuickLinksData = {
  a?: unknown;
};

interface CollectedData {
  b?: unknown;
}

function databaseFetchKey(
  { data: {}, type }: SavedComponentProps<ReleaseQuickLinksData>,
  preview: boolean,
) {
  return getFetchKey(type, { preview });
}

function ReleaseQuickLinksComponent() {
  return (
    <div className="border-t border-b border-dashed py-5">
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
      >
        All Version Quick Links
      </h3>
      <ul className="flex felx-row gap-6">
        <li>
          <MaybeLink href="a-link" className="text-primary">
            WHAT&apos;S NEW -&gt;
          </MaybeLink>
        </li>
        <li>
          <MaybeLink href="a-link" className="text-primary">
            RELEASE NOTES -&gt;
          </MaybeLink>
        </li>
        <li>
          <MaybeLink href="a-link" className="text-primary">
            DOWNLOADS -&gt;
          </MaybeLink>
        </li>
      </ul>
    </div>
  );
}

const releaseQuickLinks = Object.assign(ReleaseQuickLinksComponent, {
  registerDataCollector(
    props: SavedComponentProps<ReleaseQuickLinksData>,
    preview: boolean,
  ) {
    return {
      fetchKey: databaseFetchKey(props, preview),
      async collect(): Promise<CollectedData> {
        return {};
      },
    };
  },
});

export default releaseQuickLinks;
