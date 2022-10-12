import type {
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextPage,
} from 'next';
import { StandardPageEntry, getPage } from 'src/utils/contentful/standardPage';
import Layout from 'src/components/contentful/Layout';
import { WithGlobals } from 'src/utils/types';

type Props = {
  page: StandardPageEntry;
};

const Home: NextPage<Props> = (props) => {
  return (
    <>
      {props.page.fields.pageLayout.map((layoutProps) => (
        <Layout key={layoutProps.id} {...layoutProps} />
      ))}
    </>
  );
};

export default Home;

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<WithGlobals<Props>>> {
  const slug = '/';
  const preview = ctx.preview || false;
  try {
    const page = await getPage({
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
      props: { page, preview },
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
