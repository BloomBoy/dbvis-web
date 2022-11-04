import { SafeEntryFields } from './contentful';
import getConfig from 'next/config';

export type MenuItem = {
  id: SafeEntryFields.Symbol;
  title: SafeEntryFields.Symbol;
  targetUrl?: SafeEntryFields.Symbol;
  styles: SafeEntryFields.Symbol[];
  subItems?: MenuItem[];
};

export type Menu = {
  id: SafeEntryFields.Symbol;
  menuItems: MenuItem[];
};

const { publicRuntimeConfig } = getConfig();

export const menus: {
  [menuId: string]: Menu | undefined;
} = publicRuntimeConfig.menus;

export default function getMenu(id: string): Menu {
  const menu = menus[id];
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
