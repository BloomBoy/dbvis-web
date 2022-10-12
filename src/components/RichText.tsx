import { EntryFields } from 'contentful';
import React from 'react';
import classNames from 'classnames';
import renderRichText from 'src/utils/contentful/rich-text-renderer';

export default function RichText({
  content,
  className,
}: {
  content: EntryFields.RichText;
  className?: string;
}): JSX.Element {
  return (
    <div className={classNames('prose', className)}>
      {renderRichText(content)}
    </div>
  );
}
