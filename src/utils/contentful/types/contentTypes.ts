import type { Menu, MenuItem } from '../../menus';
import type { WithLayoutFields } from '../parseLayout';
import type * as SafeEntryFields from './SafeEntryFields';

export type ContentTypeFieldsMap = {
  standardPage: WithLayoutFields<{
    title: SafeEntryFields.Symbol;
    slug: SafeEntryFields.Symbol;
  }>;
  menu: Omit<Menu, 'menuItems' | 'id'> & {
    menuId: SafeEntryFields.Symbol;
    menuItems: SafeEntryFields.SafeEntry<ContentTypeFieldsMap['menuItem']>[];
  };
  menuItem: Omit<MenuItem, 'subItems'> & {
    subItems?: SafeEntryFields.SafeEntry<ContentTypeFieldsMap['menuItem']>[];
  };
  userReview: {
    firstName?: SafeEntryFields.Symbol;
    lastName?: SafeEntryFields.Symbol;
    role?: SafeEntryFields.Symbol;
    score: SafeEntryFields.Number;
    review: SafeEntryFields.RichText;
    source: SafeEntryFields.SafeEntry<ContentTypeFieldsMap['reviewSource']>;
    weight: SafeEntryFields.Number;
  };
  reviewSource: {
    name: SafeEntryFields.Symbol;
    logo: SafeEntryFields.Asset;
    url?: SafeEntryFields.Symbol;
    reviewMaxScore: SafeEntryFields.Number;
    averageScore?: SafeEntryFields.Number;
  };
  stringToken: {
    key: SafeEntryFields.Symbol;
    value: SafeEntryFields.Symbol;
  };
  databasePage: WithLayoutFields<{
    title: SafeEntryFields.Symbol;
    listTitle: SafeEntryFields.Symbol;
    slug: SafeEntryFields.Symbol;
    logo: SafeEntryFields.SafeAsset;
    description: SafeEntryFields.RichText;
    keywords?: SafeEntryFields.Symbols;
    searchable: SafeEntryFields.Boolean;
    weight: SafeEntryFields.Number;
  }>;
  extraDatabaseSearchResult: {
    title: SafeEntryFields.Symbol;
    logo: SafeEntryFields.SafeAsset;
    description: SafeEntryFields.RichText;
    keywords?: SafeEntryFields.Symbols;
    targetUrl: SafeEntryFields.Symbol;
    weight: SafeEntryFields.Number;
  };
};
