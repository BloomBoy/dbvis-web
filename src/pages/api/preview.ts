import { NextApiRequest, NextApiResponse } from 'next';
import * as Contentful from 'contentful';
import { ContentTypeFieldsMap } from 'src/utils/contentful';
import { objectEntries, fromEntries } from 'src/utils/objects';
import getContentfulClient from 'src/utils/getContentfulClient.mjs';

class HttpError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
HttpError.prototype.name = HttpError.name;

const simpleUrlPrefix = {
  standardPage: '/',
  databasePage: '/database/',
};

function makeUrlMap<
  T extends {
    [key in Exclude<keyof ContentTypeFieldsMap, keyof typeof simpleUrlPrefix>]:
      | ((
          entry: Contentful.Entry<ContentTypeFieldsMap[key]>,
        ) => Promise<string> | string)
      | null;
  },
>(o: T) {
  return o as {
    [key in keyof T & keyof ContentTypeFieldsMap]: T[key] extends null
      ? null
      : (
          entry: Contentful.Entry<ContentTypeFieldsMap[key]>,
        ) => Promise<string> | string;
  };
}

const typeUrlMap = makeUrlMap({
  userReview: null,
  reviewSource: null,
  stringToken: () => '/',
  menu: () => '/',
  menuItem: () => '/',
  extraDatabaseSearchResult: null,
});

type MapFn<T extends [keyof ContentTypeFieldsMap, string]> = [
  T[0],
  (
    entry: Contentful.Entry<ContentTypeFieldsMap[T[0]]>,
  ) => Promise<string> | string,
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
            throw new HttpError(400, 'Invalid slug on entry');
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

function isValidEntry(entry: Contentful.Entry<unknown>): entry is ValidEntry {
  return Object.hasOwn(contentTypeUrlMap, entry.sys.contentType.sys.id);
}

function getUrl<T extends ValidEntry>(entry: T): Promise<string> | string {
  const resolver = contentTypeUrlMap[entry.sys.contentType.sys.id] as Extract<
    typeof typeUrlMap[keyof typeof typeUrlMap],
    (entry: T) => Promise<string> | string
  > | null;
  if (resolver == null) {
    throw new HttpError(400, 'Unsupported contentType for preview');
  }
  return resolver(entry);
}

type ValidEntry = {
  [key in keyof typeof contentTypeUrlMap]: Contentful.Entry<
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

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { secret, id } = req.query;
  if (secret !== process.env.CF_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const client = getContentfulClient(true);

  const entry = await client.getEntry(id);

  if (!isValidEntry(entry)) {
    return res.status(400).json({ message: 'Invalid contentType for entry' });
  }
  try {
    const url = await getUrl(entry);

    // Enable Preview Mode by setting the cookies
    res.setPreviewData({ previewToken: process.env.CF_PREVIEW_ACCESS_TOKEN });

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    return res.writeHead(307, { Location: url }).end();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(401).json({ message: err.message });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Unknown Error' });
  }
}
