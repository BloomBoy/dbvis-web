import type { NextPage } from 'next';
import { getPage } from 'src/utils/contentful/content/standardPage';
import {
  LayoutList,
  LayoutListEntryProps,
} from 'src/components/contentful/Layout';
import { patchStaticProps } from 'src/utils/patchStaticProps';
import { WithLayoutData } from 'src/utils/types';
import SEO from 'src/components/SEO';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { SafeEntryFields } from 'src/utils/contentful';
import { savedLayoutListToProps } from 'src/utils/contentful/parseLayout';

type Props = {
  title: SafeEntryFields.Symbol;
  seoDescription: SafeEntryFields.Symbol | null;
  seoKeywords: SafeEntryFields.Symbols | null;
  mergeKeywords: SafeEntryFields.Boolean;
  layout: LayoutListEntryProps[];
  seoEmbedImage: SafeEntryFields.Asset | null;
};

const Home: NextPage<Props> = ({
  title,
  layout,
  seoDescription,
  seoKeywords,
  seoEmbedImage,
}) => {
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
        title={title || undefined}
        description={seoDescription || undefined}
        image={image || undefined}
        keywords={seoKeywords || undefined}
      />
      <LayoutList layouts={layout} />;
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
      const {
        internalTitle,
        title,
        pageLayout: layout,
        seoKeywordsMode,
        seoKeywords,
        seoDescription = null,
        seoEmbedImage = null,
      } = page.fields;
      const mergeKeywords =
        seoKeywordsMode !== 'Include content tags' &&
        seoKeywordsMode !== 'Only include the keywords specified above';
      const includeTags =
        seoKeywordsMode === 'Include content tags' ||
        seoKeywordsMode === 'Include content tags and site keywords';
      return {
        props: {
          layout: await savedLayoutListToProps(
            layout,
            collectedData,
            preview,
            {},
          ),
          mergeKeywords,
          title: title || internalTitle,
          collectedData,
          seoDescription,
          seoKeywords: includeTags
            ? [
                ...(seoKeywords ?? []),
                ...page.metadata.tags.map((t) => t.sys.id),
              ]
            : seoKeywords ?? null,
          seoEmbedImage,
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
