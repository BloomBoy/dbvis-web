import { isAsset, isLink, SafeEntryFields } from './contentful';
import { ContentTypeFieldsMap } from 'src/utils/contentful';
import { objectEntries, fromEntries } from 'src/utils/objects';

const simpleUrlPrefix = {
  standardPage: '/',
  databasePage: '/database/',
};

function makeUrlMap<
  T extends {
    [key in Exclude<keyof ContentTypeFieldsMap, keyof typeof simpleUrlPrefix>]:
      | ((entry: SafeEntryFields.Entry<ContentTypeFieldsMap[key]>) => string)
      | null;
  },
>(o: T) {
  return o as {
    [key in keyof T & keyof ContentTypeFieldsMap]: T[key] extends null
      ? null
      : (entry: SafeEntryFields.Entry<ContentTypeFieldsMap[key]>) => string;
  };
}

const typeUrlMap = makeUrlMap({
  userReview: null,
  reviewSource: null,
  stringToken: null,
  menu: null,
  menuItem: null,
  extraDatabaseSearchResult: null,
  productIndex: ({ fields: { slug } }) => {
    return `${slug === '/' ? '' : slug}/download`;
  },
});

type MapFn<T extends [keyof ContentTypeFieldsMap, string]> = [
  T[0],
  (entry: SafeEntryFields.Entry<ContentTypeFieldsMap[T[0]]>) => string | null,
];

const contentTypeUrlMap = {
  ...fromEntries(
    objectEntries(simpleUrlPrefix).map((entry) => {
      const ret: MapFn<typeof entry> = [
        entry[0],
        ({
          fields: { slug },
        }: {
          readonly fields: { readonly slug: unknown };
        }) => {
          if (typeof slug !== 'string' || slug === '') {
            return null;
          }
          if (slug === '/') return entry[1];
          return `${entry[1]}${encodeURIComponent(slug)}`;
        },
      ];
      return ret;
    }),
  ),
  ...typeUrlMap,
};

export function isValidEntry(
  entry: SafeEntryFields.Entry<unknown>,
): entry is ValidEntry {
  return Object.hasOwn(contentTypeUrlMap, entry.sys.contentType.sys.id);
}

export function getEntryUrl<T extends ValidEntry>(entry: T): string | null {
  const resolver = contentTypeUrlMap[entry.sys.contentType.sys.id] as Extract<
    typeof contentTypeUrlMap[keyof typeof contentTypeUrlMap],
    (entry: T) => string | null
  > | null;
  if (resolver == null) {
    return null;
  }
  return resolver(entry);
}

type ValidEntry = {
  [key in keyof typeof contentTypeUrlMap]: SafeEntryFields.Entry<
    ContentTypeFieldsMap[key]
  > & {
    sys: {
      contentType: {
        sys: {
          id: key;
        };
      };
    };
  };
}[keyof typeof contentTypeUrlMap];

function getUrlFromEntryOrAsset(
  entryOrAsset: SafeEntryFields.Entry<unknown> | SafeEntryFields.Asset,
): { href: string; title?: string; contentType?: string } | null {
  if (isAsset(entryOrAsset)) {
    return {
      href: entryOrAsset.fields.file.url,
      title: entryOrAsset.fields.title,
      contentType: entryOrAsset.fields.file.contentType,
    };
  }
  if (isValidEntry(entryOrAsset)) {
    const href = getEntryUrl(entryOrAsset);
    if (href == null) return null;
    return {
      href,
    };
  }
  return null;
}

export function resolveUrl(target: string): {
  href: string;
  title: string;
};
export function resolveUrl(
  target:
    | string
    | SafeEntryFields.SafeEntry<unknown>
    | SafeEntryFields.SafeAsset
    | undefined
    | null,
): { href: string; title: string } | null;
export function resolveUrl(
  target:
    | string
    | SafeEntryFields.SafeEntry<unknown>
    | SafeEntryFields.SafeAsset
    | undefined
    | null,
): { href: string; title?: string } | null {
  if (target == null) {
    return null;
  }
  if (typeof target === 'string') {
    return {
      href: target,
    };
  }

  if (isLink(target)) {
    if (target.sys.linkType === 'Asset') {
      return null;
    }
    return null;
  }

  return getUrlFromEntryOrAsset(target);
}
