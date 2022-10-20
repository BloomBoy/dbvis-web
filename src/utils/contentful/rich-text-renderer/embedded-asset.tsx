import { Block, Inline } from '@contentful/rich-text-types';
import ContentfulImage from './image';
import React from 'react';
import useImage from 'src/utils/useImage';

export default function EmbeddedAsset({
  data: { target },
}: Block | Inline): React.ReactNode {
  const image = useImage(target);
  if (image == null) return null;
  const isImage = true;
  if (isImage) {
    return (
      <ContentfulImage
        sys={image.sys}
        // Change fields format to what <Image /> expects
        fields={{
          title: image.fields.title,
          image: image,
        }}
        toPlainObject={image.toPlainObject}
        update={(() => {}) as any}
        metadata={image.metadata}
      />
    );
  }

  // Ignore all other asset types, e.g. PDFs, other docs etc.
  return null;
}
