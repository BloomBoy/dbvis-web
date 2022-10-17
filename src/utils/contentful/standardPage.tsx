import * as Contentful from 'contentful';
import { ContentTypeFieldsMap, GetBaseEntryParams } from './types';
import type { LayoutProps } from 'src/components/contentful/Layout';
import { getClient } from './client';

const getStandardPageQuery = (params: GetBaseEntryParams) => ({
  limit: 1,
  include: 1,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'standardPage',
});

export function parseLayout(layout: LayoutProps[]): Promise<LayoutProps[]> {
  return Promise.resolve(layout);
}

export async function getPage(params: GetBaseEntryParams) {
  const query = getStandardPageQuery(params);
  const { items } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['standardPage']
  >(query);
  const rawPage = items.at(0);
  if (!rawPage) return null;
  return {
    ...rawPage,
    fields: {
      ...rawPage.fields,
      pageLayout: await parseLayout(rawPage.fields.pageLayout),
    },
  };
}

export type StandardPageEntry = Contentful.Entry<
  ContentTypeFieldsMap['standardPage']
>;
