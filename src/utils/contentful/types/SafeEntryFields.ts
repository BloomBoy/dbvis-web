/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Asset as ContentfulAsset,
  EntryFields,
  Metadata,
  Sys,
} from 'contentful';
import type {
  ContentfulFieldLink,
  SafeAsset,
  SafeEntry,
} from './contentfulTypes';

export type Array<T = any> = Symbols | SafeAssets | Entries<T>;
export type Boolean = EntryFields.Boolean;
export type Date = EntryFields.Date;
export interface Entry<T = any> {
  sys: Sys;
  fields: T;
  metadata: Metadata;
}
export type Entries<T> = Entry<T>[];
export type Integer = EntryFields.Integer;
export type Link<T> = Asset | Entry<T> | ContentfulFieldLink<'Asset' | 'Entry'>;
export type Location = EntryFields.Location;
export type Number = EntryFields.Number;
export type Object<T = any> = EntryFields.Object<T>;
export type RichText = EntryFields.RichText;
export type Symbol = EntryFields.Symbol;
export type Symbols = EntryFields.Symbol[];
export type Asset = Entry<ContentfulAsset['fields']>;
export type Assets = Asset[];
export type Text = EntryFields.Text;

export type { SafeEntry, SafeAsset };
export type SafeAssets = SafeAsset[];
export type SafeEntries<T> = SafeEntry<T>[];
type Primitives = EntryFields.Boolean | EntryFields.Number | EntryFields.Symbol;

export type Any<ObjectType = never> =
  | Array
  | Date
  | Integer
  | Link<any>
  | Location
  | EntryFields.Object<ObjectType>
  | RichText
  | Text
  | Primitives;
