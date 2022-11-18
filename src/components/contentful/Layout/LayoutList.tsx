import React, { useMemo } from 'react';
import Layout from './Layout';
import LayoutLink from './LayoutLink';
import { LayoutListEntryProps, SavedLayoutListEntry } from './types';
import { isLinkProps } from './helpers';
import { layoutHeaderCount } from './LayoutRenderers';
import useCollectedData from 'src/hooks/useCollectedData';

export interface LayoutListProps {
  layouts: SavedLayoutListEntry[];
  startMainHeaderIndex?: number;
}

function getHeaderCount(
  layout: SavedLayoutListEntry,
  collectedData: Record<string, unknown>,
  startHeaderIndex: number,
): number {
  if (isLinkProps(layout)) {
    return LayoutLink.headerCount(layout, collectedData, startHeaderIndex);
  }
  return layoutHeaderCount(layout, collectedData, startHeaderIndex);
}

function LayoutOrLink(props: LayoutListEntryProps) {
  if (isLinkProps(props)) {
    return <LayoutLink {...props} />;
  }
  return <Layout {...props} />;
}

export default function LayoutList({
  layouts,
  startMainHeaderIndex,
}: LayoutListProps): JSX.Element {
  const collectedData = useCollectedData();
  const layoutsWithHeaderCount = useMemo(() => {
    let headerCount = startMainHeaderIndex ?? 0;
    return layouts.map((layout) => {
      const thisHeaderCount = getHeaderCount(
        layout,
        collectedData,
        startMainHeaderIndex ?? 0,
      );
      const currentCount = headerCount;
      headerCount = currentCount + thisHeaderCount;
      return [layout, currentCount] as const;
    });
  }, [layouts, startMainHeaderIndex, collectedData]);

  return (
    <>
      {layoutsWithHeaderCount.map(([layoutProps, mainHeaderIndex]) => (
        <LayoutOrLink
          {...layoutProps}
          key={layoutProps.id}
          mainHeaderIndex={mainHeaderIndex}
        />
      ))}
    </>
  );
}

export function WhatsNewLayoutList({
  layouts,
  startMainHeaderIndex,
}: LayoutListProps): JSX.Element {
  const collectedData = useCollectedData();
  const layoutsWithHeaderCount = useMemo(() => {
    let headerCount = startMainHeaderIndex ?? 0;
    return layouts.map((layout) => {
      const thisHeaderCount = getHeaderCount(
        layout,
        collectedData,
        startMainHeaderIndex ?? 0,
      );
      const currentCount = headerCount;
      headerCount = currentCount + thisHeaderCount;
      return [layout, currentCount] as const;
    });
  }, [layouts, startMainHeaderIndex, collectedData]);

  return (
    <>
      {layoutsWithHeaderCount.map(([layoutProps, mainHeaderIndex]) => (
        <div
          key={layoutProps.id}
          className="border-t border-dotted border-[#dddddd]"
        >
          <LayoutOrLink {...layoutProps} mainHeaderIndex={mainHeaderIndex} />
        </div>
      ))}
    </>
  );
}
