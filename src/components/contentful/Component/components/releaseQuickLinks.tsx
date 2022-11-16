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

const LinkComponent = ({ link, text }: { link: string; text: string }) => {
  return (
    <li>
      <MaybeLink
        href={link}
        className="text-primary hover:text-primary-700 underline"
      >
        {text}
      </MaybeLink>
    </li>
  );
};

const quickLinks = [
  {
    link: '/whatsnew',
    text: "WHAT'S NEW ->",
  },
  {
    link: '/releasenotes',
    text: 'RELEASE NOTES ->',
  },
  {
    link: '/download',
    text: 'DOWNLOADS ->',
  },
] as const;

function ReleaseQuickLinksComponent() {
  return (
    <div className="py-5">
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
      >
        All Version Quick Links
      </h3>
      <ul className="flex felx-row gap-6">
        {quickLinks.map(({ link, text }) => (
          <LinkComponent key={text} link={link} text={text} />
        ))}
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
