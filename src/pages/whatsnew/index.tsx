import { Link } from 'react-scroll';
import RichText from 'src/components/RichText';
import { SafeEntryFields } from 'src/utils/contentful';

type WhatsNewPageProps = {
  release: {
    name: string;
    releaseDate: string;
  };
};

const content = [
  {
    id: 'gfjkalgj',
    navLink: {
      title: 'SSH CONFIGURATION',
      id: 'SSH_CONFIGURATION',
    },
    richText: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: 'SSH configuration',
              nodeType: 'text',
            },
          ],
          nodeType: 'heading-2',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'SSH tunnel setup has been redesigned from being defined per individual database connections to a separate feature allowing shared SSH configurations by multiple database connections. Administration is now a lot easier and the new testing feature eases the burden of understanding why a connection cannot be established.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
      ],
      nodeType: 'document',
    },
  },
  {
    id: 'gfherhh',
    navLink: {
      title: 'Image Rendering',
      id: 'IMAGE_RENDERING',
    },
    richText: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: 'Images in binary data types can now be rendered in grids',
              nodeType: 'text',
            },
          ],
          nodeType: 'heading-2',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'Viewing images in binary data fields has until now only been possible by individually opening the cell. With the new support, images can be displayed as thumbnails in the grid. The size can be controlled in Tool Properties.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
      ],
      nodeType: 'document',
    },
  },
] as const;

export default function WhatsNewPage({ release }: WhatsNewPageProps) {
  return (
    <div className="flex flex-row">
      <div className="w-1/4 hidden lg:block relative border-r border-dotted">
        <div className="fixed w-1/4">
          <div className="p-10 flex flex-col items-end">
            <ul>
              <li key="#link_Welcome" className="cursor-pointer">
                <Link
                  type="button"
                  to="link_Welcome"
                  className="text-grey"
                  offset={-64}
                  smooth
                >
                  Welcome
                </Link>
              </li>
              {content
                .filter(({ navLink }) => navLink?.id && navLink?.title)
                .map(({ navLink }) => (
                  <li key={navLink.id} className="cursor-pointer">
                    <Link
                      type="button"
                      to={`link_${navLink.id}`}
                      className="text-grey"
                      offset={-64}
                      smooth
                    >
                      {navLink.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        id="link_Welcome"
        className="flex flex-col flex-1 py-20 scroll-smooth"
      >
        {/* Header */}
        <div className="w-full px-10">
          <span className="text-grey">
            {release.name} released on {release.releaseDate}
          </span>
          <h1 className="text-6xl font-extrabold">{`What's new in ${release.name}`}</h1>
        </div>

        {/* Content */}
        <hr className="border-dotted border-grey-500 my-16 opacity-20" />
        {content.map((c) => (
          <div
            id={c?.navLink?.id ? `link_${c.navLink.id}` : undefined}
            key={c.id}
          >
            <hr className="border-dotted border-grey-500 my-16 opacity-20" />
            <div className="p-10">
              {/*  */}
              <RichText
                content={c.richText as unknown as SafeEntryFields.RichText}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps(): Promise<{ props: WhatsNewPageProps }> {
  //   ctx: GetStaticPropsContext,
  //   GetStaticPropsResult<WithGlobals<WithCollectedData<WhatsNewPageProps>>>
  //   const preview = ctx.preview || false;
  return {
    props: {
      //   preview,
      release: {
        name: '14.0',
        releaseDate: '2022-09-12',
      },
    },
  };
}
