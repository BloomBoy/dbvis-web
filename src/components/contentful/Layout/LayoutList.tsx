import React, { useMemo } from 'react';
import Layout from './Layout';
import LayoutLink from './LayoutLink';
import { LayoutListEntryProps } from './types';
import { isLinkProps } from './helpers';
import { layoutHeaderCount } from './LayoutRenderers';
import useCollectedData from 'src/hooks/useCollectedData';

export interface LayoutListProps {
  layouts: LayoutListEntryProps[];
}

function getHeaderCount(
  layout: LayoutListEntryProps,
  collectedData: Record<string, unknown>,
): number {
  if (isLinkProps(layout)) {
    return LayoutLink.headerCount(layout, collectedData);
  }
  return layoutHeaderCount(layout, collectedData);
}

function LayoutOrLink(props: LayoutListEntryProps) {
  if (isLinkProps(props)) {
    return <LayoutLink {...props} />;
  }
  return <Layout {...props} />;
}

export default function LayoutList({ layouts }: LayoutListProps): JSX.Element {
  const collectedData = useCollectedData();
  const layoutsWithHeaderCount = useMemo(() => {
    let headerCount = 0;
    return layouts.map((layout) => {
      const thisHeaderCount = getHeaderCount(layout, collectedData);
      const currentCount = headerCount;
      headerCount = currentCount + thisHeaderCount;
      return [layout, currentCount] as const;
    });
  }, [layouts, collectedData]);

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
