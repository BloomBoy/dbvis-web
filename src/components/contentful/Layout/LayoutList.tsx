import React, { useMemo } from 'react';
import Layout from './Layout';
import LayoutLink from './LayoutLink';
import { LayoutListEntryProps } from './types';
import { isLinkProps } from './helpers';

export interface LayoutListProps {
  layouts: LayoutListEntryProps[];
}

function getHeaderCount(layout: LayoutListEntryProps): number {
  if (isLinkProps(layout)) {
    return LayoutLink.headerCount(layout);
  }
  return Layout.headerCount(layout);
}

function LayoutOrLink(props: LayoutListEntryProps) {
  if (isLinkProps(props)) {
    return <LayoutLink {...props} />;
  }
  return <Layout {...props} />;
}

export default function LayoutList({ layouts }: LayoutListProps): JSX.Element {
  const layoutsWithHeaderCount = useMemo(() => {
    let headerCount = 0;
    return layouts.map((layout) => {
      const thisHeaderCount = getHeaderCount(layout);
      const currentCount = headerCount;
      headerCount = currentCount + thisHeaderCount;
      return [layout, thisHeaderCount != 0, currentCount] as const;
    });
  }, [layouts]);

  return (
    <>
      {layoutsWithHeaderCount.map(
        ([layoutProps, canRenderMainHeader, mainHeaderIndex]) =>
          canRenderMainHeader ? (
            <LayoutOrLink
              {...layoutProps}
              key={layoutProps.id}
              mainHeaderIndex={mainHeaderIndex}
            />
          ) : (
            <LayoutOrLink {...layoutProps} key={layoutProps.id} />
          ),
      )}
    </>
  );
}
