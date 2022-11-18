import { GetStaticProps, GetStaticPropsResult, PreviewData } from 'next';
import { ParsedUrlQuery } from 'node:querystring';
import { SafeEntryFields, SafeValue } from './contentful';
import { getProductIndex, LATEST } from './contentful/content/release';
import {
  PickedProductRelease,
  getProductRelease,
} from './contentful/content/release/productRelease';
import { getAllStringTokens } from './contentful/content/stringTokens';
import {
  PageContextProductIndexFields,
  PageContextFeatureVersionFields,
} from './contentful/pageContext';
import { WithGlobals } from './types';

async function getGlobalData(
  preview: boolean | undefined,
  locale: string | undefined,
): Promise<WithGlobals<unknown>> {
  const { pageContext } = await getProductIndex(
    {
      slug: '/',
      preview: preview,
    },
    {
      pickFields: [],
      featureVersion: LATEST,
    },
  );
  let defaultProductIndex: SafeEntryFields.Entry<
    SafeValue<PageContextProductIndexFields>
  > | null = null;
  let latestFeatureVersion: SafeEntryFields.Entry<
    SafeValue<PageContextFeatureVersionFields>
  > | null = null;
  let latestProductRelease: SafeEntryFields.Entry<
    SafeValue<PickedProductRelease<'download'>>
  > | null = null;
  if (pageContext.productIndex != null) {
    defaultProductIndex = pageContext.productIndex;
  }
  if (pageContext.featureVersion != null) {
    latestFeatureVersion = pageContext.featureVersion;
  }
  if (latestFeatureVersion != null) {
    latestProductRelease = await getProductRelease(
      {
        version: LATEST,
        featureVersion: latestFeatureVersion.sys.id,
        preview,
      },
      {
        pickFields: ['download'],
      },
    );
  }
  const baseData = {
    defaultProductIndex,
    latestFeatureVersion,
    latestProductRelease,
    stringSymbols: null,
  };
  if (!preview) {
    return baseData;
  }
  return {
    ...baseData,
    stringSymbols: await getAllStringTokens({
      locale,
      preview,
    }),
  };
}

export function patchStaticProps<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(): GetStaticProps<WithGlobals<unknown>, Q, D>;
export function patchStaticProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  getStaticProps: GetStaticProps<P, Q, D>,
): GetStaticProps<WithGlobals<P>, Q, D>;
export function patchStaticProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  getStaticProps?: GetStaticProps<P, Q, D>,
): GetStaticProps<WithGlobals<P> | WithGlobals<unknown>, Q, D>;
export function patchStaticProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  toPatch?: GetStaticProps<P, Q, D>,
): GetStaticProps<WithGlobals<unknown>, Q, D> {
  return async function getStaticProps(...args) {
    const [ctx] = args;
    if (toPatch == null) {
      return {
        props: await getGlobalData(ctx.preview, ctx.locale),
        revalidate: 12,
      };
    }
    const [ret, globalData] = await Promise.all([
      toPatch(...args),
      getGlobalData(ctx.preview, ctx.locale),
    ]);
    if ('props' in ret && ret.props != null) {
      Object.assign(ret.props, globalData);
    }
    return ret as GetStaticPropsResult<WithGlobals<P>>;
  };
}
