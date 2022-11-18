import type {
  LayoutLinkProps,
  LayoutListEntryProps,
  SavedLayoutLink,
  SavedLayoutListEntry,
} from '../types';
import Layout from '../Layout';
import LayoutLink from '../LayoutLink';
import { SafeValue } from 'src/utils/contentful';
import { useMemo } from 'react';
import { layoutHeaderCount, layoutHeaders } from '../LayoutRenderers';
import useCollectedData from 'src/hooks/useCollectedData';
import { isLinkProps } from '../helpers';
import { isNonNull } from 'src/utils/filters';
import { PageContext } from 'src/utils/contentful/pageContext';

function getHeaderCount(
  layout: SavedLayoutListEntry,
  collectedData: Record<string, unknown>,
  startMainHeaderIndex: number,
): number {
  if (isLinkProps(layout)) {
    return LayoutLink.headerCount(layout, collectedData, startMainHeaderIndex);
  }
  return layoutHeaderCount(layout, collectedData, startMainHeaderIndex);
}

function getHeaders(
  layout: SavedLayoutListEntry,
  collectedData: Record<string, unknown>,
  startMainHeaderIndex: number,
  preview: boolean,
  context: PageContext,
) {
  if (isLinkProps(layout)) {
    return LayoutLink.headers(
      layout,
      collectedData,
      startMainHeaderIndex,
      preview,
      context,
    );
  }
  return layoutHeaders(
    layout,
    collectedData,
    startMainHeaderIndex,
    preview,
    context,
  );
}

function LayoutOrLink(props: LayoutListEntryProps) {
  if (isLinkProps(props)) {
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
      const thisHeaderCount = getHeaderCount(
        layout,
        collectedData,
        headerCount,
      );
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
            <LayoutOrLink
              {...layoutProps}
              mainHeaderIndex={mainHeaderIndex}
              key={layoutProps.id}
            />
          ),
      )}
    </>
  );
}

const layoutBlockLink = Object.assign(LayoutBlockLinkComp, {
  headerCount(
    props: SafeValue<SavedLayoutLink>,
    collectedData: Record<string, unknown>,
    startHeaderIndex: number,
  ) {
    const pageLayout = props.target?.fields?.pageLayout;
    if (pageLayout == null) return 0;
    return pageLayout.reduce((count, layout) => {
      if (layout == null) return count;
      return count + getHeaderCount(layout, collectedData, count);
    }, startHeaderIndex);
  },
  headers(
    props: SafeValue<SavedLayoutLink>,
    collectedData: Record<string, unknown>,
    startMainHeaderIndex: number,
    preview: boolean,
    context: PageContext,
  ) {
    const pageLayout = props?.target?.fields?.pageLayout;
    if (pageLayout == null) return [];
    let count = startMainHeaderIndex;
    return pageLayout
      .flatMap((savedLayout) => {
        if (savedLayout == null) return [];
        const ret = getHeaders(
          savedLayout,
          collectedData,
          count,
          preview,
          context,
        );
        if (ret != null) {
          count += ret.length;
        }
        return ret;
      })
      .filter(isNonNull);
  },
});

export default layoutBlockLink;
