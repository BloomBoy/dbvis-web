import { Block, Inline } from '@contentful/rich-text-types';
import React from 'react';
import RichTextEmbed from 'src/components/contentful/RichTextEmbed';
import { isEntryOrAsset } from 'src/utils/contentful';

export default function EmbeddedAsset({
  data: { target },
}: Block | Inline): React.ReactNode {
  if (!isEntryOrAsset(target)) return null;
  return <RichTextEmbed linkedEntity={target} />;
}
