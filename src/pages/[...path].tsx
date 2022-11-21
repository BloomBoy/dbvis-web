import type { NextPage } from 'next';
import {
  StandardPageEntry,
  getPage,
} from 'src/utils/contentful/content/standardPage';
import { LayoutList } from 'src/components/contentful/Layout';
import { patchStaticProps } from 'src/utils/patchStaticProps';
import { WithLayoutData } from 'src/utils/types';
import SEO from 'src/components/SEO';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

type Props = {
  page: StandardPageEntry;
};

const Home: NextPage<Props> = (props) => {
  const {
    internalTitle,
    pageLayout,
    seoDescription,
    seoKeywords,
    seoEmbedImage,
    title,
  } = props.page.fields;
  const router = useRouter();
  const image = useMemo(() => {
    const file = seoEmbedImage?.fields.file;
    if (file == null) return null;
    if (file.contentType === 'image/gif') return file.url;
    let fm: null | string = null;
    if (file.contentType !== 'image/png' || file.contentType !== 'image/png') {
      fm = 'png';
    }
    const baseUrl = new URL(
      router.asPath,
      process.env.BASE_URL ?? 'https://dbvis.com',
    );
    const url = new URL(file.url, baseUrl);
    if (fm) url.searchParams.set('fm', fm);
    url.searchParams.set('w', '1200');
    url.searchParams.set('h', '630');
    return url.href;
  }, [seoEmbedImage?.fields.file, router.asPath]);
  return (
    <>
      <SEO
        title={title || internalTitle}
        description={seoDescription || undefined}
        image={image || undefined}
        keywords={seoKeywords || undefined}
      />
      <LayoutList layouts={pageLayout} />;
    </>
  );
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
