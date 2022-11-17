import { useRouter } from 'next/router';
import MaybeLink from 'src/components/contentful/MaybeLink';
import usePageContext from 'src/hooks/usePageContex';
import { PageContext } from 'src/utils/contentful/pageContext';
import getFetchKey from 'src/utils/getFetchKey';
import { ComponentProps, SavedComponentProps } from '..';

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
  const { query } = useRouter();
  const queryVersion =
    typeof query.version === 'string' ? query.version : undefined;
  return (
    <li>
      <MaybeLink
        href={queryVersion ? `${link}/${queryVersion}` : link}
        className="text-primary hover:text-primary-700 uppercase underline"
      >
        {text}
      </MaybeLink>
    </li>
  );
};

const quickLinks = [
  {
    link: '/whatsnew',
    text: "What's New ->",
  },
  {
    link: '/releasenotes',
    text: 'Release Notes ->',
  },
  {
    link: '/download',
    text: 'Downloads ->',
  },
] as const;

function ReleaseQuickLinksComponent({
  id,
}: ComponentProps<ReleaseQuickLinksData>) {
  const context = usePageContext();
  if (context.featureVersion == null) return null;
  return (
    <div className="py-5">
      <h3
        id={id}
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
      >
        {context.featureVersion.fields.version} Quick Links
      </h3>
      <ul className="flex flex-row gap-6">
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
  headers(
    props: ComponentProps<ReleaseQuickLinksData>,
    collectedDataMap: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) {
    if (context.featureVersion == null) return undefined;
    return [
      {
        id: props.id,
        subTitle: `${context.featureVersion.fields.version} Quick Links`,
        linkText: 'Quick Links',
      },
    ];
  },
});

export default releaseQuickLinks;
