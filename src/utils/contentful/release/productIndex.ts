import {
  ContentTypeFieldsMap,
  GetSlugEntryParams,
  SafeEntryFields,
} from '../types';
import getClient from 'src/utils/getContentfulClient.mjs';
import { SafeValue, safeValue } from '../helpers';
import parseLayout from '../parseLayout';
import verifyContentfulResult from '../verifyContentfulResuls';

const getSingleProductIndexQuery = (
  params: GetSlugEntryParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['productIndex'])[],
) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'productIndex',
  ...(pickFields != null
    ? {
        select: ['sys', ...pickFields.map((field) => `fields.${field}`)].join(
          ',',
        ),
      }
    : null),
});

async function parseProductIndex<
  T extends Partial<ContentTypeFieldsMap['productIndex']>,
>(
  preview: boolean,
  rawProductIndex: SafeEntryFields.Entry<T>,
): Promise<{
  productIndex: SafeEntryFields.Entry<SafeValue<T>>;
  collectedData: Record<string, unknown>;
}> {
  const { sys, fields, metadata } = rawProductIndex;
  let collectedData: Record<string, unknown> = {},
    downloadLayoutList:
      | Awaited<ReturnType<typeof parseLayout>>['layoutList']
      | undefined,
    changelogIndexLayoutList:
      | Awaited<ReturnType<typeof parseLayout>>['layoutList']
      | undefined,
    changelogLayoutList:
      | Awaited<ReturnType<typeof parseLayout>>['layoutList']
      | undefined;
  if (fields.downloadLayout != null) {
    ({ collectedData, layoutList: downloadLayoutList } = await parseLayout(
      preview,
      {
        fields: {
          pageLayout: fields.downloadLayout,
          pageAssetReferences: fields.downloadAssetReferences ?? [],
          pageEntryReferences: fields.downloadEntryReferences ?? [],
        },
      },
      { collectedData },
    ));
  }
  if (fields.changelogIndexLayout != null) {
    ({ collectedData, layoutList: changelogIndexLayoutList } =
      await parseLayout(
        preview,
        {
          fields: {
            pageLayout: fields.changelogIndexLayout,
            pageAssetReferences: fields.changelogIndexAssetReferences ?? [],
            pageEntryReferences: fields.changelogIndexEntryReferences ?? [],
          },
        },
        { collectedData },
      ));
  }
  if (fields.changelogLayout != null) {
    ({ collectedData, layoutList: changelogLayoutList } = await parseLayout(
      preview,
      {
        fields: {
          pageLayout: fields.changelogLayout,
          pageAssetReferences: fields.changelogAssetReferences ?? [],
          pageEntryReferences: fields.changelogEntryReferences ?? [],
        },
      },
      { collectedData },
    ));
  }
  const safeFields = safeValue<typeof fields>(fields);
  const newFields = {
    ...safeFields,
    ...(downloadLayoutList != null
      ? { downloadLayout: downloadLayoutList }
      : null),
    ...(changelogIndexLayoutList != null
      ? { changelogIndexLayout: changelogIndexLayoutList }
      : null),
    ...(changelogLayoutList != null
      ? { changelogLayout: changelogLayoutList }
      : null),
  };
  const productIndex: SafeEntryFields.Entry<SafeValue<T>> = {
    sys,
    fields: newFields,
    metadata,
  };
  return {
    productIndex,
    collectedData,
  };
}

export async function getProductIndex(params: GetSlugEntryParams): Promise<{
  productIndex: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['productIndex']>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getProductIndex<
  T extends keyof ContentTypeFieldsMap['productIndex'],
>(
  params: GetSlugEntryParams,
  pickFields: readonly T[],
): Promise<{
  productIndex: SafeEntryFields.Entry<
    Pick<SafeValue<ContentTypeFieldsMap['productIndex']>, T>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getProductIndex(
  params: GetSlugEntryParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['productIndex'])[],
): Promise<{
  productIndex: Partial<
    Awaited<ReturnType<typeof parseProductIndex>>['productIndex']
  > | null;
  collectedData: Record<string, unknown>;
}> {
  const query = getSingleProductIndexQuery(params, pickFields);
  const {
    items: [rawProductIndex],
  } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['productIndex']
  >(query);
  const verifiedProductIndex = verifyContentfulResult(
    'productIndex',
    rawProductIndex,
    params.preview,
    pickFields,
  );
  if (!verifiedProductIndex)
    return {
      productIndex: null,
      collectedData: {},
    };
  return parseProductIndex(params.preview ?? false, verifiedProductIndex);
}
