import type { Menu, MenuItem } from '../../menus';
import type { EntryFields } from 'contentful';
import type { SafeEntry } from './contentfulTypes';
import type { StandardPageFields } from '../standardPage';

export type ContentTypeFieldsMap = {
  standardPage: StandardPageFields;
  menu: Omit<Menu, 'menuItems' | 'id'> & {
    menuId: EntryFields.Symbol;
    menuItems: SafeEntry<ContentTypeFieldsMap['menuItem']>[];
  };
  menuItem: Omit<MenuItem, 'subItems'> & {
    subItems?: SafeEntry<ContentTypeFieldsMap['menuItem']>[];
  };
};
