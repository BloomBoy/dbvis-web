import { Asset, Entry, LinkType, Locale, Sys, Tag } from 'contentful';

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
