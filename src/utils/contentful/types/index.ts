import type { ContentTypeFieldsMap } from './contentTypes';
import type { Entry } from 'contentful';
export * from './contentfulTypes';
export * as SafeEntryFields from './SafeEntryFields';

export type GetBaseEntryParams = {
  slug: string;
  locale?: string;
  preview?: boolean;
};

type ContentTypes = keyof ContentTypeFieldsMap;

export type ContentfulEntry<Type extends ContentTypes> = Entry<
  ContentTypeFieldsMap[Type]
>;

export type ContentfulFields<Type extends ContentTypes> =
  ContentTypeFieldsMap[Type];

export type { ContentTypes, ContentTypeFieldsMap };
