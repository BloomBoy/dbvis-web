import * as Contentful from 'contentful';
import { GetBaseEntryParams, getClient } from './client';
import type { LayoutProps } from 'src/components/contentful/Layout';

const getEmployeeQuery = (params: GetBaseEntryParams) => ({
  limit: 1,
  include: 1,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'standardPage',
});

export type StandardPageFields = {
  title: Contentful.EntryFields.Symbol;
  slug: Contentful.EntryFields.Symbol;
  pageLayout: Contentful.EntryFields.Object<LayoutProps>[];
};

export function parseLayout(layout: LayoutProps[]): Promise<LayoutProps[]> {
  return Promise.resolve(layout);
}

export async function getPage(params: GetBaseEntryParams) {
  const query = getEmployeeQuery(params);
  const { items } = await getClient(
    params.preview,
  ).getEntries<StandardPageFields>(query);
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

export type StandardPageEntry = Contentful.Entry<StandardPageFields>;
