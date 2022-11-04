import {
  ContentTypeFieldsMap,
  GetPaginatedParams,
  GetTaggedParams,
  GetSlugEntryParams,
  SafeEntryFields,
} from './types';
import getClient from '../getContentfulClient.mjs';
import { isLink, SafeValue, safeValue } from './helpers';
import parseLayout from './parseLayout';
import type { DatabaseListEntry } from 'src/components/ShowDatabases';
import { isNonNull } from '../filters';
import contentTypeSchemas from './schemas';
import { fromEntries } from '../objects';

const getSingleDatabasePageQuery = (
  params: GetSlugEntryParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['databasePage'])[],
) => ({
  limit: 1,
  include: 2,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'databasePage',
  ...(pickFields != null
    ? {
        select: ['sys', ...pickFields.map((field) => `fields.${field}`)].join(
          ',',
        ),
      }
    : null),
});

async function parseFullDatabasePage<
  T extends Partial<ContentTypeFieldsMap['databasePage']>,
>(
  preview: boolean,
  rawPage: SafeEntryFields.Entry<T>,
): Promise<{
  page: SafeEntryFields.Entry<SafeValue<T>>;
  collectedData: Record<string, unknown>;
}> {
  const { sys, fields, metadata } = rawPage;
  let collectedData,
    layoutList:
      | Awaited<ReturnType<typeof parseLayout>>['layoutList']
      | undefined;
  if (fields.pageLayout != null) {
    ({ collectedData, layoutList } = await parseLayout(preview, {
      fields: {
        pageLayout: fields.pageLayout,
        pageAssetReferences: fields.pageAssetReferences ?? [],
        pageEntryReferences: fields.pageEntryReferences ?? [],
      },
    }));
  } else {
    collectedData = {};
  }
  const safeFields = safeValue<typeof fields>(fields);
  const newFields = {
    ...safeFields,
    pageLayout: layoutList,
  };
  const page: SafeEntryFields.Entry<SafeValue<T>> = {
    sys,
    fields: newFields,
    metadata,
  };
  return {
    page,
    collectedData,
  };
}

export async function getDatabasePage(params: GetSlugEntryParams): Promise<{
  page: SafeEntryFields.Entry<
    SafeValue<ContentTypeFieldsMap['databasePage']>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getDatabasePage<
  T extends readonly (keyof ContentTypeFieldsMap['databasePage'])[],
>(
  params: GetSlugEntryParams,
  pickFields: T,
): Promise<{
  page: SafeEntryFields.Entry<
    Pick<SafeValue<ContentTypeFieldsMap['databasePage']>, T[number]>
  > | null;
  collectedData: Record<string, unknown>;
}>;
export async function getDatabasePage(
  params: GetSlugEntryParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['databasePage'])[],
): Promise<{
  page: Partial<
    Awaited<ReturnType<typeof parseFullDatabasePage>>['page']
  > | null;
  collectedData: Record<string, unknown>;
}> {
  const query = getSingleDatabasePageQuery(params, pickFields);
  const {
    items: [rawDatabasePage],
  } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['databasePage']
  >(query);
  const pickSchema =
    pickFields != null
      ? contentTypeSchemas.databasePage.pick(
          fromEntries(pickFields.map((key) => [key, true] as const)),
        )
      : contentTypeSchemas.databasePage;
  const verified = pickSchema.safeParse(rawDatabasePage?.fields).success;
  if (!rawDatabasePage || !verified)
    return {
      page: null,
      collectedData: {},
    };
  return parseFullDatabasePage(params.preview ?? false, rawDatabasePage);
}

export interface GetDatabasePagesParams extends GetTaggedParams {
  searchable?: boolean;
}

export interface GetPagedDatabasePagesParams
  extends GetDatabasePagesParams,
    GetPaginatedParams {}

const getDatabasePagesQuery = (
  params: GetDatabasePagesParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['databasePage'])[],
) => ({
  include: 2,
  locale: params.locale,
  ...(params.tags != null
    ? { 'metadata.tags.sys.id[in]': params.tags?.join(',') }
    : null),
  ...(params.searchable != null
    ? { 'fields.searchable': params.searchable }
    : null),
  content_type: 'databasePage',
  order: 'fields.weight,fields.title',
  ...(pickFields != null
    ? {
        select: ['sys', ...pickFields.map((field) => `fields.${field}`)].join(
          ',',
        ),
      }
    : null),
});

const getPagedDatabasePagesQuery = (
  params: GetPagedDatabasePagesParams,
  pickFields?: readonly (keyof ContentTypeFieldsMap['databasePage'])[],
) => ({
  ...getDatabasePagesQuery(params, pickFields),
  limit: params.count,
  skip: params.skip,
});

export const listFields = [
  'listTitle',
  'slug',
  'weight',
  'logo',
  'description',
  'keywords',
  'searchable',
] as const;

export type ListEntryFields = Pick<
  ContentTypeFieldsMap['databasePage'],
  typeof listFields[number]
>;

const listSchema = contentTypeSchemas.databasePage.pick(
  fromEntries(listFields.map((key) => [key, true] as const)),
);

export function parseListItem({
  sys: { id },
  fields,
}: SafeEntryFields.Entry<Partial<ListEntryFields>>): DatabaseListEntry | null {
  const { keywords, listTitle, searchable, slug, logo, weight } = fields;
  const verified = listSchema.safeParse(fields);
  if (
    listTitle == null ||
    slug == null ||
    isLink(logo) ||
    logo == null ||
    !verified
  )
    return null;
  return {
    id,
    title: listTitle,
    keywords: keywords ?? [],
    logo: {
      src: logo.fields.file.url,
      alt: listTitle,
    },
    searchable: searchable ?? false,
    url: `/database/${encodeURIComponent(slug)}`,
    weight: weight ?? 0,
  };
}

export async function getDatabaseListEntries(
  params: GetPagedDatabasePagesParams,
) {
  const query = getPagedDatabasePagesQuery(params, listFields);
  const { items, limit, skip, total } = await getClient(
    params.preview,
  ).getEntries<ListEntryFields>(query);
  const databasePageListEntries = items.map(parseListItem).filter(isNonNull);
  return {
    databasePageListEntries,
    limit,
    skip,
    total,
  };
}

export async function getAllDatabaseListEntries(
  params: GetDatabasePagesParams,
) {
  const query = {
    ...getDatabasePagesQuery(params, listFields),
    limit: 100,
    skip: 0,
  };
  const items: SafeEntryFields.Entry<ListEntryFields>[] = [];
  let total = Infinity;
  do {
    let newItems;
    ({
      items: newItems,
      skip: query.skip,
      total,
    } = await getClient(params.preview).getEntries<ListEntryFields>(query));
    if (newItems.length === 0) break;
    query.skip += newItems.length;
    items.push(...newItems);
  } while (items.length < total);
  const databasePageListEntries = items.map(parseListItem).filter(isNonNull);
  return databasePageListEntries;
}

export type DatabasePageEntry = SafeEntryFields.Entry<
  SafeValue<ContentTypeFieldsMap['databasePage']>
>;
