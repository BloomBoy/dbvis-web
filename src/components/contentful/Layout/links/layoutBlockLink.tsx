import type { LayoutLinkProps, LayoutListEntryProps } from '../types';
import Layout from '../Layout';
import LayoutLink from '../LayoutLink';
import { SafeValue } from 'src/utils/contentful';
import { useMemo } from 'react';
import { layoutHeaderCount } from '../LayoutRenderers';
import useCollectedData from 'src/hooks/useCollectedData';

function isLink(
  listEntry: LayoutListEntryProps,
): listEntry is SafeValue<LayoutLinkProps> {
  return listEntry.type.endsWith('Link');
}

function getHeaderCount(
  layout: LayoutListEntryProps,
  collectedData: Record<string, unknown>,
): number {
  if (isLink(layout)) {
    return LayoutLink.headerCount(layout, collectedData);
  }
  return layoutHeaderCount(layout, collectedData);
}

function LayoutOrLink(props: LayoutListEntryProps) {
  if (isLink(props)) {
    return <LayoutLink {...props} />;
  }
  return <Layout {...props} />;
}

function LayoutBlockLinkComp({
  target,
  mainHeaderIndex: startHeaderIndex,
}: SafeValue<LayoutLinkProps>): JSX.Element | null {
  const collectedData = useCollectedData();
  const layoutsWithHeaderCount = useMemo(() => {
    if (target == null) return [];
    let headerCount = startHeaderIndex ?? 0;
    return target.fields.pageLayout.map((layout) => {
      const thisHeaderCount = getHeaderCount(layout, collectedData);
      const currentCount = headerCount;
      headerCount = currentCount + thisHeaderCount;
      return [layout, thisHeaderCount != 0, currentCount] as const;
    });
  }, [target, startHeaderIndex, collectedData]);

  if (target == null) return null;
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

const layoutBlockLink = Object.assign(LayoutBlockLinkComp, {
  headerCount(
    props: SafeValue<LayoutLinkProps>,
    collectedData: Record<string, unknown>,
  ) {
    const pageLayout = props.target?.fields?.pageLayout;
    if (pageLayout == null) return 0;
    return pageLayout.reduce((count, layout) => {
      if (layout == null) return count;
      return count + getHeaderCount(layout, collectedData);
    }, 0);
  },
});

export default layoutBlockLink;
