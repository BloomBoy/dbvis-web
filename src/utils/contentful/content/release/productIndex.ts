import {
  ContentTypeFieldsMap,
  GetSlugEntryParams,
  SafeEntryFields,
} from '../../types';
import getClient from 'src/utils/getContentfulClient.mjs';
import { SafeValue, safeValue } from '../../helpers';
import parseLayout from '../../parseLayout';
import verifyContentfulResult from '../../verifyContentfulResult';
import {
  PageContext,
  PageContextProductIndexFields,
  PRODUCT_INDEX_OPTIONAL_FIELDS,
} from '../../pageContext';
import contentTypeSchemas from '../../schemas';
import { objectKeys } from 'src/utils/objects';
import { VersionParam, getFeatureVersion } from './featureVersion';
import { getProductRelease } from './productRelease';

const obligatoryFields = objectKeys(
  contentTypeSchemas.productIndex.shape,
).filter(
  (
    field,
  ): field is Exclude<
    typeof field,
    typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
  > =>
    !(PRODUCT_INDEX_OPTIONAL_FIELDS as readonly typeof field[]).includes(field),
);

const getSingleProductIndexQuery = (
  params: GetSlugEntryParams,
  pickFields?: readonly typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number][],
) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'productIndex',
  ...(pickFields != null
    ? {
        select: [
          'sys',
          'metadata',
          ...obligatoryFields.map((field) => `fields.${field}`),
          ...pickFields.map((field) => `fields.${field}`),
        ].join(','),
      }
    : null),
});

function isEnoughForContext(
  fields: Partial<ContentTypeFieldsMap['productIndex']>,
): fields is PageContextProductIndexFields {
  return obligatoryFields.every((field) => fields[field] != null);
}

async function parseProductIndex<
  T extends Partial<ContentTypeFieldsMap['productIndex']>,
>(
  rawProductIndex: SafeEntryFields.Entry<Readonly<T>>,
  {
    preview,
    pageContext = {},
    collectedData = {},
    featureVersion: featureVersionParam,
    releaseVersion: releaseVersionParam,
  }: {
    preview: boolean;
    pageContext?: PageContext;
    collectedData?: Record<string, unknown>;
    featureVersion?: VersionParam;
    releaseVersion?: VersionParam;
  },
): Promise<{
  productIndex: SafeEntryFields.Entry<SafeValue<T>>;
  collectedData: Record<string, unknown>;
  pageContext: PageContext;
}> {
  const { sys, fields, metadata } = rawProductIndex;

  if (isEnoughForContext(fields)) {
    const contextProductIndex: SafeEntryFields.Entry<
      SafeValue<PageContextProductIndexFields>
    > = {
      sys: rawProductIndex.sys,
      fields: {
        active: safeValue(fields.active),
        slug: safeValue(fields.slug),
        name: safeValue(fields.name),
        type: safeValue(fields.type),
      },
      metadata: rawProductIndex.metadata,
    };

    pageContext.productIndex = contextProductIndex;

    const { featureVersion } =
      featureVersionParam != null
        ? await getFeatureVersion(
            {
              version: featureVersionParam,
              productIndex: contextProductIndex.sys.id,
              preview,
            },
            { collectedData, pickFields: [], pageContext },
          )
        : { featureVersion: null };

    if (featureVersion != null) {
      pageContext.featureVersion = featureVersion;
    }

    const productRelease =
      releaseVersionParam != null && featureVersion != null
        ? await getProductRelease(
            {
              version: releaseVersionParam,
              featureVersion: featureVersion.sys.id,
              preview,
            },
            { collectedData, pickFields: [], pageContext },
          )
        : null;
    if (productRelease != null) {
      pageContext.productRelease = productRelease;
    }
  }

  let downloadLayoutList:
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
      { collectedData, pageContext },
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
        { collectedData, pageContext },
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
      { collectedData, pageContext },
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
    pageContext,
  };
}

export type PickedProductIndex<T extends string> = Extract<
  T,
  typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
> extends never
  ? {
      [key in keyof (Omit<
        ContentTypeFieldsMap['productIndex'],
        typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
      > &
        Partial<
          Pick<
            ContentTypeFieldsMap['productIndex'],
            typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
          >
        >)]: (Omit<
        ContentTypeFieldsMap['productIndex'],
        typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
      > &
        Partial<
          Pick<
            ContentTypeFieldsMap['productIndex'],
            typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
          >
        >)[key];
    }
  : {
      [key in keyof (Omit<
        ContentTypeFieldsMap['productIndex'],
        typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
      > &
        Pick<
          ContentTypeFieldsMap['productIndex'],
          Extract<T, typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]>
        >)]: (Omit<
        ContentTypeFieldsMap['productIndex'],
        typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]
      > &
        Pick<
          ContentTypeFieldsMap['productIndex'],
          Extract<T, typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number]>
        >)[key];
    };

export async function getProductIndex<
  T extends typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number],
>(
  params: GetSlugEntryParams,
  options: {
    pickFields: readonly T[];
    collectedData?: Record<string, unknown>;
    featureVersion?: VersionParam;
    releaseVersion?: VersionParam;
  },
): Promise<{
  productIndex: SafeEntryFields.Entry<SafeValue<PickedProductIndex<T>>> | null;
  collectedData: Record<string, unknown>;
  pageContext: PageContext;
}>;
export async function getProductIndex(
  params: GetSlugEntryParams,
  options?: {
    collectedData?: Record<string, unknown>;
    featureVersion?: VersionParam;
    releaseVersion?: VersionParam;
  },
): Promise<{
  productIndex: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['productIndex']>
  > | null;
  collectedData: Record<string, unknown>;
  pageContext: PageContext;
}>;
export async function getProductIndex<
  T extends typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number],
>(
  params: GetSlugEntryParams,
  options?: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    featureVersion?: VersionParam;
    releaseVersion?: VersionParam;
  },
): Promise<{
  productIndex:
    | SafeEntryFields.Entry<SafeValue<PickedProductIndex<T>>>
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productIndex']>>
    | null;
  collectedData: Record<string, unknown>;
  pageContext: PageContext;
}>;
export async function getProductIndex(
  params: GetSlugEntryParams,
  {
    pickFields,
    collectedData,
    featureVersion,
    releaseVersion,
  }: {
    pickFields?: readonly typeof PRODUCT_INDEX_OPTIONAL_FIELDS[number][];
    collectedData?: Record<string, unknown>;
    featureVersion?: VersionParam;
    releaseVersion?: VersionParam;
  } = {},
): Promise<{
  productIndex: SafeEntryFields.Entry<
    SafeValue<PickedProductIndex<string>>
  > | null;
  collectedData: Record<string, unknown>;
  pageContext: PageContext;
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
    pickFields
      ? ([...obligatoryFields, ...pickFields] as typeof obligatoryFields)
      : undefined,
  );
  if (!verifiedProductIndex)
    return {
      productIndex: null,
      collectedData: collectedData ?? {},
      pageContext: {},
    };
  return parseProductIndex(verifiedProductIndex, {
    preview: params.preview ?? false,
    featureVersion,
    collectedData,
    releaseVersion,
  });
}
