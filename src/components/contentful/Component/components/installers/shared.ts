import type { SavedComponentProps } from 'src/components/contentful/Component';
import type { ContentTypeFieldsMap } from 'src/utils/contentful';
import {
  getFeatureVersion,
  getProductIndex,
  LATEST,
} from 'src/utils/contentful/content/release';
import {
  getProductRelease,
  getProductReleaseById,
} from 'src/utils/contentful/content/release/productRelease';
import type { PageContext } from 'src/utils/contentful/pageContext';
import getFetchKey from 'src/utils/getFetchKey';

export function downloadsFetchKey(
  // eslint-disable-next-line @typescript-eslint/ban-types
  { data: {} }: SavedComponentProps<{}>,
  context: PageContext,
  preview: boolean,
) {
  return getFetchKey(
    'downloads',
    { preview },
    context.productIndex?.sys.id,
    context.featureVersion?.sys.id,
    context.productRelease?.sys.id,
  );
}

export type CollectedData = {
  version: string;
  download: ContentTypeFieldsMap['productRelease']['download'];
};

export function registerDataCollector(
  // eslint-disable-next-line @typescript-eslint/ban-types
  props: SavedComponentProps<{}>,
  preview: boolean,
  context: PageContext,
) {
  return {
    fetchKey: downloadsFetchKey(props, context, preview),
    async collect(): Promise<CollectedData | undefined> {
      if (context.productRelease) {
        const productRelease = await getProductReleaseById(
          context.productRelease.sys.id,
          { preview, pickFields: ['download', 'version'] },
        );
        if (productRelease == null) return undefined;
        return {
          version: productRelease.fields.version,
          download: productRelease.fields.download,
        };
      }
      if (context.featureVersion != null) {
        const productRelease = await getProductRelease(
          {
            version: LATEST,
            featureVersion: context.featureVersion.sys.id,
            preview,
          },
          { pickFields: ['download'] },
        );
        if (productRelease == null) return undefined;
        return {
          version: productRelease.fields.version,
          download: productRelease.fields.download,
        };
      }
      if (context.productIndex != null) {
        const { featureVersion } = await getFeatureVersion(
          {
            version: LATEST,
            productIndex: context.productIndex.sys.id,
            preview,
          },
          { pickFields: [] },
        );
        if (featureVersion == null) return undefined;
        const productRelease = await getProductRelease(
          {
            version: LATEST,
            featureVersion: featureVersion.sys.id,
            preview,
          },
          { pickFields: ['download'] },
        );
        if (productRelease == null) return undefined;
        return {
          version: productRelease.fields.version,
          download: productRelease.fields.download,
        };
      }
      const {
        pageContext: { featureVersion },
      } = await getProductIndex(
        {
          slug: '/',
          preview,
        },
        { featureVersion: LATEST, pickFields: [] },
      );
      if (featureVersion == null) return undefined;
      const productRelease = await getProductRelease(
        {
          version: LATEST,
          featureVersion: featureVersion.sys.id,
          preview,
        },
        { pickFields: ['download'] },
      );
      if (productRelease == null) return undefined;
      return {
        version: productRelease.fields.version,
        download: productRelease.fields.download,
      };
    },
  };
}
