import { Asset, LinkType, Locale, Metadata, Sys, Tag } from 'contentful';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Entry<T = any> {
  sys: Sys;
  fields: T;
  metadata: Metadata;
}

export const VALID_LINK_TYPES = [
  'Entry',
  'Asset',
  'Tag',
  'Space',
  'ContentType',
  'Environment',
] as const;

export type ContentfulFieldLink<
  LinkTargetType extends typeof VALID_LINK_TYPES[number] =
    | 'Entry'
    | 'Asset'
    | 'Tag'
    | LinkType,
> = {
  sys: {
    type: 'Link';
    linkType: LinkTargetType;
    id: string;
  };
};

export type ContentfulEntity =
  | {
      sys: Sys;
    }
  | ContentfulFieldLink
  | Tag
  | Locale;

export type SafeEntry<T> = Entry<T> | ContentfulFieldLink<'Entry'>;
export type SafeAsset = Asset | ContentfulFieldLink<'Asset'>;
