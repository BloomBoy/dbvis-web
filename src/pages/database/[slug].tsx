import type {
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextPage,
} from 'next';
import { LayoutList } from 'src/components/contentful/Layout';
import { WithCollectedData, WithGlobals } from 'src/utils/types';
import { getGlobalData } from 'src/utils/getGlobalData';
import {
  DatabasePageEntry,
  getDatabasePage,
} from 'src/utils/contentful/databasePage';
import SubHeader from 'src/components/PageLayout/navigation/Header/SubHeader';

type Props = {
  page: DatabasePageEntry;
};

const Home: NextPage<Props> = (props) => {
  return (
    <>
      <SubHeader fields={props.page.fields} />
      <LayoutList layouts={props.page.fields.pageLayout} />
    </>
  );
};

export default Object.assign(Home, {
  pageConfig: {
    headerMode: 'static',
  },
});

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<WithGlobals<WithCollectedData<Props>>>> {
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
      props: { page, collectedData, ...(await getGlobalData(ctx)) },
      revalidate: 12,
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
      revalidate: 12,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
