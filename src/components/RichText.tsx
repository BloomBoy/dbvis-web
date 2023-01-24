import { SafeEntryFields } from 'src/utils/contentful';
import React from 'react';
import classNames from 'classnames';
import renderRichText from 'src/utils/contentful/rich-text-renderer';

export default function RichText({
  content,
  className,
  style,
}: {
  content: SafeEntryFields.RichText;
  className?: string;
  style?: React.CSSProperties;
}): JSX.Element {
  return (
    <div className={classNames('prose', className)} style={{ ...style }}>
      {renderRichText(content)}
    </div>
  );
}
