import {
  BLOCKS,
  Block,
  Document,
  INLINES,
  Inline,
  MARKS,
  Node,
  NodeData,
} from '@contentful/rich-text-types';
import EmbeddedAsset from './embedded-asset';
import MaybeLink from 'src/components/contentful/MaybeLink';
import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

type HyperlinkProps = {
  data: NodeData;
  type: 'AssetLink' | 'PlainLink';
  children?: React.ReactNode;
};

function Hyperlink({ data, type, children }: HyperlinkProps): JSX.Element {
  const href = type === 'AssetLink' ? data.target.fields.file.url : data.uri;
  return <MaybeLink href={href}>{children}</MaybeLink>;
}

const PlainHyperlink = (
  props: Block | Inline,
  children: React.ReactNode,
): React.ReactNode => (
  <Hyperlink {...props} type="PlainLink">
    {children}
  </Hyperlink>
);
const AssetHyperlink = (
  props: Block | Inline,
  children: React.ReactNode,
): React.ReactNode => (
  <Hyperlink {...props} type="AssetLink">
    {children}
  </Hyperlink>
);
const Bold = ({ children }: React.PropsWithChildren): React.ReactElement => (
  <b>{children}</b>
);
const Text = ({ children }: React.PropsWithChildren): React.ReactElement => (
  <p className="align-center mb-2">{children}</p>
);

function assertEnumNodeType(rtd: Node): asserts rtd is Document {
  if (rtd.nodeType !== BLOCKS.DOCUMENT) {
    throw new Error('Rich text document must be a document');
  }
}

export default function renderRichText(rtd: Node) {
  assertEnumNodeType(rtd);
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
        .reduce(
          (
            acc: (boolean | React.ReactElement | string)[],
            textSegment: string,
            index: number,
          ) => {
            if (index > 0) {
              acc.push(<br key={index} />, textSegment);
            } else {
              acc.push(textSegment);
            }
            return acc;
          },
          [],
        );
    },
  });
}
