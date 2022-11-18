import type { NextPage } from 'next';
import {
  LayoutList,
  SavedLayoutListEntry,
} from 'src/components/contentful/Layout';
import { WithLayoutData } from 'src/utils/types';
import { getDatabasePage } from 'src/utils/contentful/content/databasePage';
import SubHeader from 'src/components/PageLayout/navigation/Header/SubHeader';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { patchStaticProps } from 'src/utils/patchStaticProps';

type Props = {
  layouts: SavedLayoutListEntry[];
  logo?: {
    src: string;
    alt: string;
  };
  title: string;
  subTitle?: string;
};

const Home: NextPage<Props> = ({ layouts, logo, title, subTitle }) => {
  const { query } = useRouter();
  const slug = typeof query.slug === 'object' ? query.slug.join() : query.slug;
  const links = useMemo(() => {
    if (slug == null) {
      return [
        {
          id: 'download',
          href: `/download`,
          text: 'Download',
          suffix: '↓',
          className: 'text-primary-500',
        },
      ];
    }
    return [
      {
        id: 'overview',
        href: `/database/${slug}`,
        text: 'Overview',
        suffix: '->',
      },
      {
        id: 'objects',
        href: `/database/${slug}/support`,
        text: 'Supported objects',
        suffix: '->',
        className: 'hidden xl:block',
      },
      {
        id: 'features',
        href: `/database/${slug}/features`,
        text: 'Features',
        suffix: '->',
        className: 'hidden xl:block',
      },
      {
        id: 'driver',
        href: `/database/${slug}/driver`,
        text: 'JDBC driver',
        suffix: '->',
        className: 'hidden xl:block',
      },
      {
        id: 'download',
        href: `/download`,
        text: 'Download',
        suffix: '↓',
        className: 'text-primary-500',
      },
    ];
  }, [slug]);
  return (
    <>
      <SubHeader links={links} icon={logo} title={title} subTitle={subTitle} />
      <LayoutList layouts={layouts} />
    </>
  );
};

export default Object.assign(Home, {
  pageConfig: {
    headerMode: 'static',
  },
});

export const getStaticProps = patchStaticProps<WithLayoutData<Props>>(
  async (ctx) => {
    const slug =
      typeof ctx.params?.slug === 'object'
        ? ctx.params.slug.join()
        : ctx.params?.slug;
    if (slug == null) {
      return {
        notFound: true,
        revalidate: 12,
      };
    }
    const preview = ctx.preview || false;
    try {
      const { page, collectedData } = await getDatabasePage({
        slug,
        locale: ctx.locale,
        preview,
      });
      if (page == null) {
        return {
          notFound: true,
          revalidate: 12,
        };
      }
      return {
        props: {
          layouts: page.fields.pageLayout,
          ...(page.fields.logo && {
            logo: {
              src: page.fields.logo.fields.file.url,
              alt: page.fields.logo.fields.title,
            },
          }),
          title: page.fields.listTitle,
          subTitle: 'TESTED FOR VERSION 8-11',
          collectedData,
        },
        revalidate: 12,
      };
    } catch (err) {
      console.error(err);
      return {
        notFound: true,
        revalidate: 12,
      };
    }
  },
);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
