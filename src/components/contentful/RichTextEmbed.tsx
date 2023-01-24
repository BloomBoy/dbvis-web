import React from 'react';
import { SafeEntryFields } from 'src/utils/contentful';

const styles = {
  image: {
    margin: 0,
    maxHeight: '33vh',
  },
};

function isAsset(
  o: SafeEntryFields.Entry<unknown>,
): o is SafeEntryFields.Asset {
  return o.sys.type === 'Asset';
}

function RichTextAsset({
  linkedEntity: {
    fields: { file, title, description },
  },
}: {
  linkedEntity: SafeEntryFields.Asset;
}) {
  const isImage = file.contentType.startsWith('image/');
  if (!isImage) return null;
  return (
    <div
      className="inline-flex flex-col items-center"
      style={{ margin: '1.2em 0' }}
    >
      <img
        className="w-auto h-auto"
        style={styles.image}
        src={`${file.url}?w=960`}
        alt={title}
      />
      <span className="py-4 text-center">{description || title}</span>
    </div>
  );
}

export default function RichTextEmbed({
  linkedEntity,
}: {
  linkedEntity: SafeEntryFields.Entry<unknown>;
}) {
  if (isAsset(linkedEntity)) {
    return <RichTextAsset linkedEntity={linkedEntity} />;
  }
  return null;
}
