import { EntryFields } from 'contentful';
import getConfig from 'next/config';

export type MenuItem = {
  id: EntryFields.Symbol;
  title: EntryFields.Symbol;
  targetUrl?: EntryFields.Symbol;
  styles: EntryFields.Symbol[];
  subItems?: MenuItem[];
};

export type Menu = {
  id: EntryFields.Symbol;
  menuItems: MenuItem[];
};

const { publicRuntimeConfig } = getConfig();

export const menues: {
  [menuId: string]: Menu | undefined;
} = publicRuntimeConfig.menues;

export default function getMenu(id: string): Menu {
  const menu = menues[id];
  if (!menu) {
    const err = new Error(`Menu with id ${id} not found`);
    console.error(err);
    return {
      id,
      menuItems: [],
    };
  }
  return menu;
}
