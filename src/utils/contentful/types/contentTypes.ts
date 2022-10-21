import type { Entry, EntryFields } from 'contentful';
import type { Menu, MenuItem } from '../../menus';
import type { LayoutProps } from '../../../components/contentful/Layout';

export type ContentTypeFieldsMap = {
  standardPage: {
    title: EntryFields.Symbol;
    slug: EntryFields.Symbol;
    pageLayout: EntryFields.Object<LayoutProps>[];
  };
  menu: Omit<Menu, 'menuItems' | 'id'> & {
    menuId: EntryFields.Symbol;
    menuItems: Entry<ContentTypeFieldsMap['menuItem']>[];
  };
  menuItem: Omit<MenuItem, 'subItems'> & {
    subItems?: Entry<ContentTypeFieldsMap['menuItem']>[];
  };
};
