import type { Entry, EntryFields } from 'contentful';
import type { ContentTypeFieldsMap } from './contentTypes';
export * from './contentfulTypes';
export * as SafeEntryFields from './SafeEntryFields';

export type GetBaseEntryParams = {
  slug: string;
  locale?: string;
  preview?: boolean;
};

type ContentTypes = keyof ContentTypeFieldsMap;

export type ContentfulEntry<Type extends ContentTypes> = Entry<
  ContentTypeFieldsMap[Type]
>;

export type ContentfulFields<Type extends ContentTypes> =
  ContentTypeFieldsMap[Type];

export type { ContentTypes, ContentTypeFieldsMap };

export interface ReviewSourceFields {
  name: EntryFields.Symbol;
  url: EntryFields.Symbol;
  maxScore: EntryFields.Number;
  averageScore: EntryFields.Number;
}

export type ReviewSource = Entry<ReviewSourceFields>;
export interface UserReviewFields {
  firstName: EntryFields.Symbol;
  lastName: EntryFields.Symbol;
  score: EntryFields.Number;
  source: ReviewSource;
  weight: EntryFields.Number;
  review: EntryFields.RichText;
}

export type UserReview = Entry<UserReviewFields>;
