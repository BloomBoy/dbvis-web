import type { NextPage } from 'next';
import {
  StandardPageEntry,
  getPage,
} from 'src/utils/contentful/content/standardPage';
import { LayoutList } from 'src/components/contentful/Layout';
import { patchStaticProps } from 'src/utils/patchStaticProps';
import { WithLayoutData } from 'src/utils/types';

type Props = {
  page: StandardPageEntry;
};

const Home: NextPage<Props> = (props) => {
  return <LayoutList layouts={props.page.fields.pageLayout} />;
};

export default Home;

export const getStaticProps = patchStaticProps<WithLayoutData<Props>>(
  async (ctx) => {
    const path =
      typeof ctx.params?.path === 'string'
        ? [ctx.params.path]
        : ctx.params?.path;
    let slug: string;
    if (path == null) {
      slug = '/';
    } else {
      slug = `${path.join('/')}`;
    }
    const preview = ctx.preview || false;
    try {
      const { page, collectedData } = await getPage({
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
        props: { page, collectedData },
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
