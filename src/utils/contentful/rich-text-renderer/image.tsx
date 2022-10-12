import * as Contentful from 'contentful';
import React from 'react';

const styles = {
  image: {
    margin: 0,
    maxHeight: '33vh',
  },
};

export default function Image({
  fields,
}: Contentful.Entry<{
  title: Contentful.EntryFields.Symbol;
  image: Contentful.Asset;
}>) {
  const { title, image } = fields;

  return (
    <div
      className="inline-flex flex-col items-center"
      style={{ margin: '1.2em 0' }}
    >
      <img
        className="w-auto h-auto"
        style={styles.image}
        src={`${image.fields.file.url}?w=960`}
        alt={title}
      />
      <span className="py-4 text-center">{title}</span>
    </div>
  );
}
