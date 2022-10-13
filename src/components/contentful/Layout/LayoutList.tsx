import React, { useMemo } from 'react';
import Layout from './Layout';
import { LayoutProps } from './types';

export interface LayoutListProps {
  layouts: LayoutProps[];
}

export default function LayoutList({ layouts }: LayoutListProps): JSX.Element {
  const layoutsWithHeaderCount = useMemo(() => {
    let headerCount = 0;
    return layouts.map((layout) => {
      const canRenderMainHeader = Layout.canRenderMainHeader(layout);
      const currentCount = headerCount;
      headerCount = canRenderMainHeader ? currentCount + 1 : currentCount;
      return [layout, canRenderMainHeader, currentCount] as const;
    });
  }, [layouts]);

  return (
    <>
      {layoutsWithHeaderCount.map(
        ([layoutProps, canRenderMainHeader, mainHeaderIndex]) =>
          canRenderMainHeader ? (
            <Layout
              {...layoutProps}
              key={layoutProps.id}
              mainHeaderIndex={mainHeaderIndex}
            />
          ) : (
            <Layout {...layoutProps} key={layoutProps.id} />
          ),
      )}
    </>
  );
}
