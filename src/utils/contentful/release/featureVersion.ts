import {
  ContentTypeFieldsMap,
  GetBaseEntryParams,
  SafeEntryFields,
} from '../types';
import getClient from 'src/utils/getContentfulClient.mjs';
import { SafeValue, safeValue } from '../helpers';
import parseLayout from '../parseLayout';
import verifyContentfulResult from '../verifyContentfulResuls';

interface GetVersionEntryParams extends GetBaseEntryParams {
  version: string;
}
const getSingleProductIndexQuery = (
  params: GetVersionEntryParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['featureVersion'])[],
) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  'fields.version': params.version,
  content_type: 'featureVersion',
  ...(pickFields != null
    ? {
        select: ['sys', ...pickFields.map((field) => `fields.${field}`)].join(
          ',',
        ),
      }
    : null),
});

async function parseFeatureVersion<
  T extends Partial<ContentTypeFieldsMap['featureVersion']>,
>(
  preview: boolean,
  rawFeatureVersion: SafeEntryFields.Entry<T>,
): Promise<{
  featureVersion: SafeEntryFields.Entry<SafeValue<T>>;
  collectedData: Record<string, unknown>;
}> {
  const { sys, fields, metadata } = rawFeatureVersion;
  let collectedData: Record<string, unknown> = {},
    whatsNewLayoutList:
      | Awaited<ReturnType<typeof parseLayout>>['layoutList']
      | undefined;
  if (fields.whatsNewLayout != null) {
    ({ collectedData, layoutList: whatsNewLayoutList } = await parseLayout(
      preview,
      {
        fields: {
          pageLayout: fields.whatsNewLayout,
          pageAssetReferences: fields.whatsNewAssetReferences ?? [],
          pageEntryReferences: fields.whatsNewEntryReferences ?? [],
        },
      },
      { collectedData },
    ));
  }
  const safeFields = safeValue<typeof fields>(fields);
  const newFields = {
    ...safeFields,
    ...(whatsNewLayoutList != null
      ? { downloadLayout: whatsNewLayoutList }
      : null),
  };
  const featureVersion: SafeEntryFields.Entry<SafeValue<T>> = {
    sys,
    fields: newFields,
    metadata,
  };
  return {
    featureVersion,
    collectedData,
  };
}

export async function getFeatureVersion(
  params: GetVersionEntryParams,
): Promise<{
  featureVersion: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['featureVersion']>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersion<
  T extends keyof ContentTypeFieldsMap['featureVersion'],
>(
  params: GetVersionEntryParams,
  pickFields: readonly T[],
): Promise<{
  featureVersion: SafeEntryFields.Entry<
    Pick<SafeValue<ContentTypeFieldsMap['featureVersion']>, T>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersion(
  params: GetVersionEntryParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['featureVersion'])[],
): Promise<{
  featureVersion: Partial<
    Awaited<ReturnType<typeof parseFeatureVersion>>['featureVersion']
  > | null;
  collectedData: Record<string, unknown>;
}> {
  const query = getSingleProductIndexQuery(params, pickFields);
  const {
    items: [rawFeatureVersion],
  } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['featureVersion']
  >(query);
  const verifiedFeatureVersion = verifyContentfulResult(
    'featureVersion',
    rawFeatureVersion,
    params.preview,
    pickFields,
  );
  if (!verifiedFeatureVersion)
    return {
      featureVersion: null,
      collectedData: {},
    };
  return parseFeatureVersion(params.preview ?? false, verifiedFeatureVersion);
}
