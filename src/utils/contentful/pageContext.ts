import { SafeValue } from './helpers';
import { ContentTypeFieldsMap, SafeEntryFields } from './types';

export const PRODUCT_INDEX_OPTIONAL_FIELDS = [
  'downloadLayout',
  'downloadAssetReferences',
  'downloadEntryReferences',
  'changelogIndexLayout',
  'changelogIndexAssetReferences',
  'changelogIndexEntryReferences',
  'changelogLayout',
  'changelogAssetReferences',
  'changelogEntryReferences',
] as const;

export const FEATURE_VERSION_OPTIONAL_FIELDS = [
  'productIndex',
  'whatsNewLayout',
  'whatsNewAssetReferences',
  'whatsNewEntryReferences',
] as const;

export const PRODUCT_RELEASE_OPTIONAL_FIELDS = [
  'featureVersion',
  'download',
  'releaseNotes',
] as const;

export type PageContextProductIndexFields = Omit<
  ContentTypeFieldsMap['productIndex'],
  typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
>;

export type PageContextFeatureVersionFields = Omit<
  ContentTypeFieldsMap['featureVersion'],
  typeof FEATURE_VERSION_OPTIONAL_FIELDS[number]
>;

export type PageContextProductReleaseFields = Omit<
  ContentTypeFieldsMap['productRelease'],
  typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number]
>;

export type PageContext = {
  productIndex?: SafeEntryFields.Entry<
    SafeValue<PageContextProductIndexFields>
  >;
  featureVersion?: SafeEntryFields.Entry<
    SafeValue<PageContextFeatureVersionFields>
  >;
  productRelease?: SafeEntryFields.Entry<
    SafeValue<PageContextProductReleaseFields>
  >;
};
