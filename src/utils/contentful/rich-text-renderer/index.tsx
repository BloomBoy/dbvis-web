import {
  BLOCKS,
  Block,
  INLINES,
  Inline,
  MARKS,
} from '@contentful/rich-text-types';
import EmbeddedAsset from './embedded-asset';
import MaybeLink from 'src/components/contentful/MaybeLink';
import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

type HyperlinkProps = {
  data: any;
  content: any;
  type: 'AssetLink' | 'PlainLink';
};

export function Hyperlink({
  data,
  type,
  content,
}: HyperlinkProps): JSX.Element {
  const href = type === 'AssetLink' ? data.target.fields.file.url : data.uri;
  // Link text has to be rendered itself as rich text
  // to account for various formatting options (e.g. bold text)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const linkText = renderRichText({
    content,
    data: {},
    nodeType: 'document',
  });
  return <MaybeLink href={href}>{linkText}</MaybeLink>;
}

const PlainHyperlink = (props: Block | Inline): React.ReactNode => (
  <Hyperlink {...props} type="PlainLink" />
);
const AssetHyperlink = (props: Block | Inline): React.ReactNode => (
  <Hyperlink {...props} type="AssetLink" />
);
const Bold = ({ children }: React.PropsWithChildren): React.ReactElement => (
  <b>{children}</b>
);
const Text = ({ children }: React.PropsWithChildren): React.ReactElement => (
  <p className="align-center mb-2">{children}</p>
);

export default function renderRichText(rtd: any) {
  return documentToReactComponents(rtd, {
    renderMark: {
      [MARKS.BOLD]: (text) => <Bold>{text}</Bold>,
    },
    renderNode: {
      [INLINES.HYPERLINK]: PlainHyperlink,
      [INLINES.ASSET_HYPERLINK]: AssetHyperlink,
      [INLINES.ENTRY_HYPERLINK]: () => null, // Ignore entry hyperlink
      [BLOCKS.EMBEDDED_ASSET]: EmbeddedAsset,
      [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    },
    renderText: (text) => {
      return text
        .split('\n')
        .reduce((children: any, textSegment: string, index: number) => {
          return [...children, index > 0 && <br key={index} />, textSegment];
        }, []);
    },
  });
}
