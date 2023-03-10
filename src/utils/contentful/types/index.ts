import type { ContentTypeFieldsMap } from './contentTypes';
import { Entry } from './SafeEntryFields';
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

export interface GetTaggedParams extends GetBaseEntryParams {
  tags?: string[];
}

export interface GetEntryByIdParams extends GetBaseEntryParams {
  id: string;
}

export interface GetSlugEntryParams extends GetBaseEntryParams {
  slug: string;
}

type ContentTypes = keyof ContentTypeFieldsMap;

export type ContentfulEntry<Type extends ContentTypes> = Entry<
  ContentTypeFieldsMap[Type]
>;

export type ContentfulFields<Type extends ContentTypes> =
  ContentTypeFieldsMap[Type];

export type { ContentTypes, ContentTypeFieldsMap };
