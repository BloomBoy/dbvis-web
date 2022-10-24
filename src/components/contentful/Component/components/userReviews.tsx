import type { ComponentProps } from '..';
import React from 'react';
import { SafeEntryFields } from 'src/utils/contentful';

type UserReviewsData = {
  initialCount?: SafeEntryFields.Integer;
  maxCount?: SafeEntryFields.Number;
  onlyTags?: SafeEntryFields.Symbols;
};

export default function Image(
  props: ComponentProps<UserReviewsData>,
): JSX.Element | null {
  const { asset } = props.data;
  if (asset == null) return null;
  const assetUrl = asset.fields.file.url;
  const assetType = asset.fields.file.contentType;
  if (assetType.startsWith('image/')) {
    return <img src={assetUrl} alt={asset.fields.title} />;
  }
  return null;
}
