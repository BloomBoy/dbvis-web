import type { Entry } from 'contentful';
import type { ContentTypeFieldsMap } from './contentTypes';
export * from './contentfulTypes';
export * as SafeEntryFields from './SafeEntryFields';

export interface GetBaseEntryParams {
  locale?: string;
  preview?: boolean;
}

export interface GetMaybePaginatedParams extends GetBaseEntryParams {
  count?: number;
  skip?: number;
}

export interface GetPaginatedParams extends GetMaybePaginatedParams {
  count: number;
  skip: number;
}

export interface GetEntryByIdParams extends GetBaseEntryParams {
  id: string;
  locale?: string;
  preview?: boolean;
}

export interface GetSlugEntryParams extends GetBaseEntryParams {
  slug: string;
  locale?: string;
  preview?: boolean;
}

type ContentTypes = keyof ContentTypeFieldsMap;

export type ContentfulEntry<Type extends ContentTypes> = Entry<
  ContentTypeFieldsMap[Type]
>;

export type ContentfulFields<Type extends ContentTypes> =
  ContentTypeFieldsMap[Type];

export type { ContentTypes, ContentTypeFieldsMap };
