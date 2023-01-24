import type {
  LayoutLinkProps,
  LayoutListEntryProps,
  SavedLayoutLink,
  SavedLayoutListEntry,
} from '../types';
import Layout from '../Layout';
import LayoutLink from '../LayoutLink';
import { SafeValue } from 'src/utils/contentful';
import { layoutHeaderCount, layoutHeaders } from '../LayoutRenderers';
import { isLinkProps } from '../helpers';
import { PageContext } from 'src/utils/contentful/pageContext';

function getHeaderCount(
  layout: SavedLayoutListEntry,
  collectedData: Record<string, unknown>,
  startMainHeaderIndex: number,
  preview: boolean,
  context: PageContext,
): Promise<number> {
  if (isLinkProps(layout)) {
    return LayoutLink.headerCount(
      layout,
      collectedData,
      startMainHeaderIndex,
      preview,
      context,
    );
  }
  return layoutHeaderCount(
    layout,
    collectedData,
    startMainHeaderIndex,
    preview,
    context,
  );
}

function getHeaders(
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

function LayoutBlockLinkComp({
  target,
}: SafeValue<LayoutLinkProps>): JSX.Element | null {
  if (target == null) return null;
  return (
    <>
      {target.fields.pageLayout?.map((layoutProps) => (
        <LayoutOrLink {...layoutProps} key={layoutProps.id} />
      ))}
    </>
  );
}

const layoutBlockLink = Object.assign(LayoutBlockLinkComp, {
  async headerCount(
    props: SafeValue<SavedLayoutLink>,
    collectedData: Record<string, unknown>,
    startHeaderIndex: number,
    preview: boolean,
    context: PageContext,
  ) {
    const pageLayout = props.target?.fields?.pageLayout;
    if (pageLayout == null) return 0;
    let count = startHeaderIndex;
    for (const layout of pageLayout) {
      const toAdd = await getHeaderCount(
        layout,
        collectedData,
        count,
        preview,
        context,
      );
      count += toAdd;
    }
    return count - startHeaderIndex;
  },
  async headers(
    props: SafeValue<LayoutLinkProps>,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) {
    const pageLayout = props?.target?.fields?.pageLayout;
    if (pageLayout == null) return [];
    const headers: Awaited<ReturnType<typeof getHeaders>> = [];
    for (const savedLayout of pageLayout) {
      headers.push(
        ...(await getHeaders(savedLayout, collectedData, preview, context)),
      );
    }
    return headers;
  },
});

export default layoutBlockLink;
