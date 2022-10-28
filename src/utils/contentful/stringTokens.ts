import { ContentTypeFieldsMap, GetTaggedParams } from './types';
import getClient from '../getContentfulClient.mjs';

const getStringTokensQuery = (params: GetTaggedParams) => ({
  limit: 100,
  locale: params.locale,
  content_type: 'userReview',
});

async function getStringTokenPage(
  preview: boolean,
  query: Record<string, unknown>,
  last: {
    skip: number;
    total: number;
    limit: number;
  },
) {
  const { items, limit, skip, total } = await getClient(preview).getEntries<
    ContentTypeFieldsMap['stringToken']
  >({
    ...query,
    skip: last.skip + last.limit,
  });
  return {
    items,
    limit,
    skip,
    total,
  };
}

export async function getAllStringTokens(params: GetTaggedParams) {
  const query = getStringTokensQuery(params);
  let last: {
    skip: number;
    total: number;
    limit: number;
  } = {
    skip: 0,
    total: 0,
    limit: 0,
  };
  const map: Record<string, string> = {};
  do {
    const { items, limit, skip, total } = await getStringTokenPage(
      params.preview ?? false,
      query,
      last,
    );
    items.forEach((entry) => {
      if (
        typeof entry.fields.key === 'string' &&
        typeof entry.fields.value === 'string'
      ) {
        map[entry.fields.key] = entry.fields.value;
      }
    });
    last = {
      skip,
      total,
      limit,
    };
  } while (last.skip + last.limit < last.total);
  return map;
}
