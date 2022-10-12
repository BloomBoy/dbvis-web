import { Block, Inline } from '@contentful/rich-text-types';
import ContentfulImage from './image';
import React from 'react';

const noop = () => {};

export default function EmbeddedAsset({
  data: {
    target: { sys, fields, metadata },
  },
}: Block | Inline): React.ReactNode {
  const isImage = fields.file.contentType.includes('image');
  if (isImage) {
    return (
      <ContentfulImage
        sys={sys}
        // Change fields format to what <Image /> expects
        fields={{
          title: fields.title,
          image: { fields } as any,
        }}
        toPlainObject={noop as any}
        update={noop as any}
        metadata={metadata}
      />
    );
  }

  // Ignore all other asset types, e.g. PDFs, other docs etc.
  return null;
}
