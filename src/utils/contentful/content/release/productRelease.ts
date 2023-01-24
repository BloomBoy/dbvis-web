import {
  ContentTypeFieldsMap,
  GetBaseEntryParams,
  SafeEntryFields,
} from 'src/utils/contentful/types';
import getClient from 'src/utils/getContentfulClient.mjs';
import {
  pickFieldsQuery,
  SafeValue,
  safeValue,
} from 'src/utils/contentful/helpers';
import verifyContentfulResult from 'src/utils/contentful/verifyContentfulResult';
import { objectKeys } from 'src/utils/objects';
import { LATEST, VersionParam } from './featureVersion';
import {
  PageContext,
  PageContextProductReleaseFields,
  PRODUCT_RELEASE_OPTIONAL_FIELDS,
} from '../../pageContext';
import contentTypeSchemas from '../../schemas';
import { isNonNull } from 'src/utils/filters';

export const obligatoryReleaseFields = objectKeys(
  contentTypeSchemas.productRelease.shape,
).filter(
  (
    field,
  ): field is Exclude<
    typeof field,
    typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number]
  > =>
    !(PRODUCT_RELEASE_OPTIONAL_FIELDS as readonly typeof field[]).includes(
      field,
    ),
);

type GetProductReleaseParams = GetBaseEntryParams &
  (
    | {
        version: string;
        featureVersion?: string;
      }
    | {
        version: VersionParam;
        featureVersion: string;
      }
  );

interface GetMultiProductReleasesParams extends GetBaseEntryParams {
  featureVersion?: string;
}

const getSingleProductReleaseQuery = (
  params: GetProductReleaseParams,
  pickFields?: readonly typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number][],
) => ({
  limit: 1,
  include: 1,
  locale: params.locale,
  ...(params.version === LATEST
    ? { order: '-fields.releaseDate' }
    : { 'fields.version': params.version }),
  ...(params.featureVersion != null
    ? { 'fields.featureVersion.sys.id': params.featureVersion }
    : null),
  content_type: 'productRelease',
  ...pickFieldsQuery(pickFields && [...obligatoryReleaseFields, ...pickFields]),
});

async function parseProductRelease<
  T extends Partial<
    ContentTypeFieldsMap['productRelease']
  > = PageContextProductReleaseFields,
>(
  rawProductRelease: SafeEntryFields.Entry<T>,
  _: {
    preview: boolean;
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<SafeEntryFields.Entry<SafeValue<T>>> {
  const { sys, fields, metadata } = rawProductRelease;
  const productRelease: SafeEntryFields.Entry<SafeValue<T>> = {
    sys,
    fields: safeValue<typeof fields>(fields),
    metadata,
  };
  return productRelease;
}

export type PickedProductRelease<
  T extends typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number],
> = {
  [key in keyof (Omit<
    ContentTypeFieldsMap['productRelease'],
    typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number]
  > &
    Pick<
      ContentTypeFieldsMap['productRelease'],
      Extract<T, typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number]>
    >)]: (Omit<
    ContentTypeFieldsMap['productRelease'],
    typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number]
  > &
    Pick<
      ContentTypeFieldsMap['productRelease'],
      Extract<T, typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number]>
    >)[key];
};

export async function getProductRelease<
  T extends typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number],
>(
  params: GetProductReleaseParams,
  options: {
    pickFields: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<SafeEntryFields.Entry<SafeValue<PickedProductRelease<T>>> | null>;
export async function getProductRelease<
  T extends typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number],
>(
  params: GetProductReleaseParams,
  options?: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<
  | SafeEntryFields.Entry<SafeValue<PickedProductRelease<T>>>
  | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productRelease']>>
  | null
>;
export async function getProductRelease<
  T extends typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number],
>(
  params: GetProductReleaseParams,
  {
    pickFields,
    collectedData,
    pageContext,
  }: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  } = {},
): Promise<
  | SafeEntryFields.Entry<SafeValue<PickedProductRelease<T>>>
  | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productRelease']>>
  | null
> {
  const query = getSingleProductReleaseQuery(params, pickFields);
  const {
    items: [rawProductRelease],
  } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['productRelease']
  >(query);
  const verifiedProductRelease = verifyContentfulResult(
    'productRelease',
    rawProductRelease,
    params.preview,
    pickFields ? [...obligatoryReleaseFields, ...pickFields] : undefined,
  );
  if (!verifiedProductRelease) return null;
  return parseProductRelease(verifiedProductRelease, {
    preview: params.preview ?? false,
    collectedData,
    pageContext,
  }) as Promise<
    | SafeEntryFields.Entry<SafeValue<PickedProductRelease<T>>>
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productRelease']>>
    | null
  >;
}

export async function getProductReleaseById<
  T extends keyof ContentTypeFieldsMap['productRelease'],
>(
  id: string,
  options: {
    preview?: boolean;
    pickFields: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<SafeEntryFields.Entry<
  SafeValue<Pick<ContentTypeFieldsMap['productRelease'], T>>
> | null>;
export async function getProductReleaseById(
  id: string,
  options: {
    preview?: boolean;
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<SafeEntryFields.Entry<
  SafeValue<ContentTypeFieldsMap['productRelease']>
> | null>;
export async function getProductReleaseById<
  T extends keyof ContentTypeFieldsMap['productRelease'],
>(
  id: string,
  options?: {
    preview?: boolean;
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<
  | SafeEntryFields.Entry<
      SafeValue<Pick<ContentTypeFieldsMap['productRelease'], T>>
    >
  | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productRelease']>>
  | null
>;
export async function getProductReleaseById<
  T extends keyof ContentTypeFieldsMap['productRelease'],
>(
  id: string,
  {
    preview,
    pickFields,
    collectedData,
    pageContext,
  }: {
    preview?: boolean;
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  } = {},
): Promise<
  | SafeEntryFields.Entry<
      SafeValue<Pick<ContentTypeFieldsMap['productRelease'], T>>
    >
  | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productRelease']>>
  | null
> {
  const query = {
    ...pickFieldsQuery(pickFields),
    content_type: 'productRelease',
  };
  const entry = await getClient(preview).getEntry<
    Partial<ContentTypeFieldsMap['productRelease']>
  >(id, query);
  return parseProductRelease(entry, {
    preview: preview ?? false,
    collectedData,
    pageContext,
  }) as Promise<
    | SafeEntryFields.Entry<
        SafeValue<Pick<ContentTypeFieldsMap['productRelease'], T>>
      >
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['productRelease']>>
    | null
  >;
}

const getMultiProductReleasesQuery = (
  params: GetMultiProductReleasesParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['productRelease'])[],
) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  order: '-fields.releaseDate',
  ...(params.featureVersion != null
    ? { 'fields.featureVersion.sys.id': params.featureVersion }
    : null),
  content_type: 'productRelease',
  ...pickFieldsQuery(
    pickFields != null ? [...obligatoryReleaseFields, ...pickFields] : null,
  ),
});

export async function getProductReleaseList<
  T extends typeof PRODUCT_RELEASE_OPTIONAL_FIELDS[number],
>(
  params: GetMultiProductReleasesParams,
  {
    pickFields,
    collectedData = {},
    pageContext,
  }: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  } = {},
): Promise<SafeEntryFields.Entry<SafeValue<PickedProductRelease<T>>>[]> {
  const query = getMultiProductReleasesQuery(params, pickFields);
  const { items } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['featureVersion']
  >(query);
  const productReleases = await Promise.all(
    items
      .map((rawFeatureVersion) =>
        verifyContentfulResult(
          'productRelease',
          rawFeatureVersion,
          params.preview,
          pickFields ? [...obligatoryReleaseFields, ...pickFields] : undefined,
        ),
      )
      .filter(isNonNull)
      .map((featureVersion) =>
        parseProductRelease(featureVersion, {
          preview: params.preview ?? false,
          collectedData,
          pageContext,
        }).then(
          (parsedProductRelease) =>
            parsedProductRelease as SafeEntryFields.Entry<
              SafeValue<PickedProductRelease<T>>
            >,
        ),
      ),
  );
  return productReleases;
}
