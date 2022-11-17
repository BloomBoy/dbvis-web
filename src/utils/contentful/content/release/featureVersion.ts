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
import parseLayout from 'src/utils/contentful/parseLayout';
import verifyContentfulResult from 'src/utils/contentful/verifyContentfulResult';
import {
  FEATURE_VERSION_OPTIONAL_FIELDS,
  PageContext,
} from '../../pageContext';
import contentTypeSchemas from '../../schemas';
import { objectKeys } from 'src/utils/objects';
import { isNonNull } from 'src/utils/filters';

export const LATEST = Symbol('latest');
export type VersionParam = string | typeof LATEST;

interface GetFeatureVersionParams extends GetBaseEntryParams {
  version: VersionParam;
  productIndex?: string;
}

interface GetMultiFeatureVersionParams extends GetBaseEntryParams {
  productIndex?: string;
}

const obligatoryFields = objectKeys(
  contentTypeSchemas.featureVersion.shape,
).filter(
  (
    field,
  ): field is Exclude<
    typeof field,
    typeof FEATURE_VERSION_OPTIONAL_FIELDS[number]
  > =>
    !(FEATURE_VERSION_OPTIONAL_FIELDS as readonly typeof field[]).includes(
      field,
    ),
);

const getSingleFeatureVersionQuery = (
  params: GetFeatureVersionParams,
  pickFields?: readonly typeof FEATURE_VERSION_OPTIONAL_FIELDS[number][],
) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  ...(params.version === LATEST
    ? { order: '-fields.releaseDate' }
    : { 'fields.version': params.version }),
  ...(params.productIndex != null
    ? { 'fields.productIndex.sys.id': params.productIndex }
    : null),
  content_type: 'featureVersion',
  ...pickFieldsQuery(pickFields && [...obligatoryFields, ...pickFields]),
});

async function parseFeatureVersion<
  T extends Partial<ContentTypeFieldsMap['featureVersion']>,
>(
  rawFeatureVersion: SafeEntryFields.Entry<T>,
  {
    preview,
    collectedData = {},
    pageContext,
  }: {
    preview: boolean;
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion: SafeEntryFields.Entry<SafeValue<T>>;
  collectedData: Record<string, unknown>;
}> {
  const { sys, fields, metadata } = rawFeatureVersion;
  let whatsNewLayoutList:
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
      { collectedData, pageContext },
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

export type PickedFeatureVersion<
  T extends typeof FEATURE_VERSION_OPTIONAL_FIELDS[number],
> = {
  [key in keyof (Omit<
    ContentTypeFieldsMap['featureVersion'],
    typeof FEATURE_VERSION_OPTIONAL_FIELDS[number]
  > &
    Pick<
      ContentTypeFieldsMap['featureVersion'],
      Extract<T, typeof FEATURE_VERSION_OPTIONAL_FIELDS[number]>
    >)]: (Omit<
    ContentTypeFieldsMap['featureVersion'],
    typeof FEATURE_VERSION_OPTIONAL_FIELDS[number]
  > &
    Pick<
      ContentTypeFieldsMap['featureVersion'],
      Extract<T, typeof FEATURE_VERSION_OPTIONAL_FIELDS[number]>
    >)[key];
};

export async function getFeatureVersion<
  T extends typeof FEATURE_VERSION_OPTIONAL_FIELDS[number],
>(
  params: GetFeatureVersionParams,
  options: {
    pickFields: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion: SafeEntryFields.Entry<
    SafeValue<PickedFeatureVersion<T>>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersion(
  params: GetFeatureVersionParams,
  options?: {
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['featureVersion']>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersion<
  T extends typeof FEATURE_VERSION_OPTIONAL_FIELDS[number],
>(
  params: GetFeatureVersionParams,
  options?: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion:
    | SafeEntryFields.Entry<SafeValue<PickedFeatureVersion<T>>>
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['featureVersion']>>
    | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersion<
  T extends typeof FEATURE_VERSION_OPTIONAL_FIELDS[number],
>(
  params: GetFeatureVersionParams,
  {
    pickFields,
    collectedData,
    pageContext,
  }: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  } = {},
): Promise<{
  featureVersion:
    | SafeEntryFields.Entry<SafeValue<PickedFeatureVersion<T>>>
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['featureVersion']>>
    | null;
  collectedData: Record<string, unknown>;
}> {
  const query = getSingleFeatureVersionQuery(params, pickFields);
  const {
    items: [rawFeatureVersion],
  } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['featureVersion']
  >(query);
  const verifiedFeatureVersion = verifyContentfulResult(
    'featureVersion',
    rawFeatureVersion,
    params.preview,
    pickFields != null ? [...obligatoryFields, ...pickFields] : undefined,
  );
  if (!verifiedFeatureVersion)
    return {
      featureVersion: null,
      collectedData: collectedData ?? {},
    };
  return parseFeatureVersion(verifiedFeatureVersion, {
    preview: params.preview ?? false,
    collectedData,
    pageContext,
  }) as Promise<{
    featureVersion:
      | SafeEntryFields.Entry<SafeValue<PickedFeatureVersion<T>>>
      | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['featureVersion']>>
      | null;
    collectedData: Record<string, unknown>;
  }>;
}

export async function getFeatureVersionById<
  T extends keyof ContentTypeFieldsMap['featureVersion'],
>(
  id: string,
  options: {
    preview?: boolean;
    pickFields: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion: SafeEntryFields.Entry<
    SafeValue<Pick<ContentTypeFieldsMap['featureVersion'], T>>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersionById(
  id: string,
  options: {
    preview?: boolean;
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['featureVersion']>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersionById<
  T extends keyof ContentTypeFieldsMap['featureVersion'],
>(
  id: string,
  options?: {
    preview?: boolean;
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
    pageContext?: PageContext;
  },
): Promise<{
  featureVersion:
    | SafeEntryFields.Entry<
        SafeValue<Pick<ContentTypeFieldsMap['featureVersion'], T>>
      >
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['featureVersion']>>
    | null;
  collectedData: Record<string, unknown>;
}>;
export async function getFeatureVersionById<
  T extends keyof ContentTypeFieldsMap['featureVersion'],
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
): Promise<{
  featureVersion:
    | SafeEntryFields.Entry<
        SafeValue<Pick<ContentTypeFieldsMap['featureVersion'], T>>
      >
    | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['featureVersion']>>
    | null;
  collectedData: Record<string, unknown>;
}> {
  const query = {
    ...pickFieldsQuery(pickFields),
    content_type: 'featureVersion',
  };
  const entry = await getClient(preview).getEntry<
    Partial<ContentTypeFieldsMap['featureVersion']>
  >(id, query);
  return parseFeatureVersion(entry, {
    preview: preview ?? false,
    collectedData,
    pageContext,
  }) as Promise<{
    featureVersion:
      | SafeEntryFields.Entry<
          SafeValue<Pick<ContentTypeFieldsMap['featureVersion'], T>>
        >
      | SafeEntryFields.Entry<SafeValue<ContentTypeFieldsMap['featureVersion']>>
      | null;
    collectedData: Record<string, unknown>;
  }>;
}

const getMultiFeatureVersionsQuery = (
  params: GetMultiFeatureVersionParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['featureVersion'])[],
) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  order: '-fields.releaseDate',
  ...(params.productIndex != null
    ? { 'fields.productIndex.sys.id': params.productIndex }
    : null),
  content_type: 'featureVersion',
  ...pickFieldsQuery(pickFields && [...obligatoryFields, ...pickFields]),
});

export async function getFeatureVersionList<
  T extends typeof FEATURE_VERSION_OPTIONAL_FIELDS[number],
>(
  params: GetMultiFeatureVersionParams,
  {
    pickFields,
    collectedData = {},
  }: {
    pickFields?: readonly T[];
    collectedData?: Record<string, unknown>;
  } = {},
): Promise<{
  featureVersions: SafeEntryFields.Entry<SafeValue<PickedFeatureVersion<T>>>[];
  collectedData: Record<string, unknown>;
}> {
  const query = getMultiFeatureVersionsQuery(params, pickFields);
  const { items } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['featureVersion']
  >(query);
  const featureVersions = await Promise.all(
    items
      .map((rawFeatureVersion) =>
        verifyContentfulResult(
          'featureVersion',
          rawFeatureVersion,
          params.preview,
          pickFields != null ? [...obligatoryFields, ...pickFields] : undefined,
        ),
      )
      .filter(isNonNull)
      .map((featureVersion) =>
        parseFeatureVersion(featureVersion, {
          preview: params.preview ?? false,
          collectedData,
        }).then(
          (parsedFeatureVersion) =>
            parsedFeatureVersion.featureVersion as SafeEntryFields.Entry<
              SafeValue<PickedFeatureVersion<T>>
            >,
        ),
      ),
  );
  return {
    featureVersions,
    collectedData,
  };
}
