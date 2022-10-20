import * as Contentful from 'contentful';
import { ContentTypeFieldsMap, GetBaseEntryParams } from './types';
import parseLayout, { LayoutFields } from './parseLayout';
import getClient from '../getContentfulClient.mjs';
import { safeValue } from './helpers';

const getStandardPageQuery = (params: GetBaseEntryParams) => ({
  limit: 1,
  include: 3,
  locale: params.locale,
  'fields.slug': params.slug,
  content_type: 'standardPageDev',
});

type Fields = {
  title: Contentful.EntryFields.Symbol;
  slug: Contentful.EntryFields.Symbol;
};

export type StandardPageFields = {
  [key in keyof LayoutFields | keyof Fields]: (LayoutFields & Fields)[key];
};

export async function getPage(params: GetBaseEntryParams) {
  const query = getStandardPageQuery(params);
  const { items } = await getClient(params.preview).getEntries<
    ContentTypeFieldsMap['standardPage']
  >(query);
  const rawPage = items.at(0);
  if (!rawPage) return null;
  return {
    ...rawPage,
    fields: safeValue<typeof rawPage.fields>({
      ...rawPage.fields,
      pageLayout: parseLayout(rawPage),
    }),
  };
}

export type StandardPageEntry = Contentful.Entry<
  ContentTypeFieldsMap['standardPage']
>;
