import type { LayoutLinkProps, SavedLayoutLink } from './types';
import React from 'react';
import { SafeValue } from 'src/utils/contentful';
import layoutBlockLink from './links/layoutBlockLink';
import { PageContext } from 'src/utils/contentful/pageContext';

interface LinkComponent<SavedEntity, Props extends SavedEntity>
  extends React.FC<Props> {
  headerCount?:
    | number
    | ((
        props: SavedEntity,
        collectedData: Record<string, unknown>,
        startHeaderIndex: number,
      ) => number);
  headers?: (
    props: SavedEntity,
    collectedData: Record<string, unknown>,
    startHeaderIndex: number,
    preview: boolean,
    context: PageContext,
  ) =>
    | {
        id: string;
        mainTitle?: string;
        subTitle?: string;
        linkText?: string;
      }[]
    | undefined;
}

export const links: Record<
  string,
  | LinkComponent<SafeValue<SavedLayoutLink>, SafeValue<LayoutLinkProps>>
  | undefined
> = {
  layoutBlockLink,
};

function LayoutLinkComp(props: SafeValue<LayoutLinkProps>): JSX.Element | null {
  const { type } = props;
  const LinkComp = links[type];
  if (LinkComp == null) {
    return null;
  }
  return <LinkComp {...props} />;
}

const LayoutLink = Object.assign(LayoutLinkComp, {
  headerCount(
    props: SafeValue<SavedLayoutLink>,
    collectedData: Record<string, unknown>,
    startHeaderIndex: number,
  ) {
    const { type } = props;
    const LayoutComponent = links[type];
    if (LayoutComponent == null) {
      return 0;
    }
    if (typeof LayoutComponent.headerCount === 'function') {
      return LayoutComponent.headerCount(
        props,
        collectedData,
        startHeaderIndex,
      );
    }
    return LayoutComponent.headerCount ?? 0;
  },
  headers(
    props: SafeValue<SavedLayoutLink>,
    collectedData: Record<string, unknown>,
    startHeaderIndex: number,
    preview: boolean,
    context: PageContext,
  ) {
    const { type } = props;
    const LayoutComponent = links[type];
    if (LayoutComponent?.headers == null) {
      return [];
    }
    return LayoutComponent.headers(
      props,
      collectedData,
      startHeaderIndex,
      preview,
      context,
    );
  },
});

export default LayoutLink;
