import getClient from '../src/utils/getContentfulClient.mjs';

/**
 * @param {ContentfulMenuItem[]} rawMenuItems
 * @returns {MenuItem[]}
 */
function convertMenuItems(rawMenuItems) {
  return rawMenuItems
    .map((rawMenuItem) => {
      if (rawMenuItem.fields.subItems) {
        const subItems = convertMenuItems(rawMenuItem.fields.subItems);
        const targetUrl = rawMenuItem.fields.targetUrl;
        if (subItems.length > 0) {
          return {
            id: rawMenuItem.sys.id,
            title: rawMenuItem.fields.title,
            subItems,
            ...(targetUrl ? { targetUrl } : null),
          };
        }
      }
      if (rawMenuItem.fields.targetUrl) {
        return {
          id: rawMenuItem.sys.id,
          title: rawMenuItem.fields.title,
          targetUrl: rawMenuItem.fields.targetUrl,
        };
      }
      return null;
    })
    .filter((item) => item != null);
}

/**
 * @param {ContentfulMenuFields} rawMenu
 * @returns {Menu}
 */
function convertMenu({ menuId, menuItems: rawMenuItems, ...rawMenu }) {
  const menuItems = convertMenuItems(rawMenuItems);
  return {
    ...rawMenu,
    id: menuId,
    menuItems,
  };
}

export default async function getMenus() {
  const client = getClient();
  let total = 0;
  let skip = 0;
  /**
   * @type {Menu[]}
   */
  const menus = [];
  do {
    /**
     * @type {import('contentful').EntryCollection<ContentfulMenuFields>}
     */
    const res = await client.getEntries({
      skip,
      content_type: 'menu',
      limit: 100,
      include: 2,
    });
    total = res.total;
    skip += res.items.length;
    if (res.items.length === 0) total = 0;
    menus.push(...res.items.map((el) => convertMenu(el.fields)));
  } while (total !== 0);
  return Object.fromEntries(menus.map((menu) => [menu.id, menu]));
}

/**
 * @typedef {import('../src/utils/contentful').ContentfulEntry<'menuItem'>} ContentfulMenuItem
 * @typedef {import('../src/utils/contentful').ContentfulFields<'menu'>} ContentfulMenuFields
 * @typedef {import('../src/utils/menus').Menu} Menu
 * @typedef {import('../src/utils/menus').MenuItem} MenuItem
 */
