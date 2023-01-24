import React from 'react';
import Layout from './Layout';
import LayoutLink from './LayoutLink';
import { LayoutListEntryProps, SavedLayoutListEntry } from './types';
import { isLinkProps } from './helpers';
import { layoutHeaderCount, layoutHeaders } from './LayoutRenderers';
import { PageContext } from 'src/utils/contentful/pageContext';

export interface LayoutListProps {
  layouts: LayoutListEntryProps[];
}

export function getLayoutHeaderCount(
  layout: SavedLayoutListEntry,
  collectedData: Record<string, unknown>,
  startHeaderIndex: number,
  preview: boolean,
  context?: PageContext,
) {
  if (isLinkProps(layout)) {
    return LayoutLink.headerCount(
      layout,
      collectedData,
      startHeaderIndex,
      preview,
      context,
    );
  }
  return layoutHeaderCount(
    layout,
    collectedData,
    startHeaderIndex,
    preview,
    context,
  );
}

export function getLayoutHeaders(
  layout: LayoutListEntryProps,
  collectedData: Record<string, unknown>,
  preview: boolean,
  context: PageContext,
) {
  if (isLinkProps(layout)) {
    return LayoutLink.headers(layout, collectedData, preview, context);
  }
  return layoutHeaders(layout, collectedData, preview, context);
}

function LayoutOrLink(props: LayoutListEntryProps) {
  if (isLinkProps(props)) {
    return <LayoutLink {...props} />;
  }
  return <Layout {...props} />;
}

export default function LayoutList({ layouts }: LayoutListProps): JSX.Element {
  return (
    <>
      {layouts.map((layoutProps) => (
        <LayoutOrLink {...layoutProps} key={layoutProps.id} />
      ))}
    </>
  );
}

export function WhatsNewLayoutList({ layouts }: LayoutListProps): JSX.Element {
  return (
    <>
      {layouts.map((layoutProps) => (
        <div
          key={layoutProps.id}
          className="border-t border-dotted border-[#dddddd]"
        >
          <LayoutOrLink {...layoutProps} />
        </div>
      ))}
    </>
  );
}
