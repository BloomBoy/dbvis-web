import type { Menu, MenuItem } from '../../menus';
import type { StandardPageFields } from '../standardPage';
import type * as SafeEntryFields from './SafeEntryFields';

export type ContentTypeFieldsMap = {
  standardPage: StandardPageFields;
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
};
