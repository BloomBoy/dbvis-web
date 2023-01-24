import type { LayoutLinkProps, SavedLayoutLink } from './types';
import React from 'react';
import { SafeValue } from 'src/utils/contentful';
import layoutBlockLink from './links/layoutBlockLink';
import { PageContext } from 'src/utils/contentful/pageContext';

interface LinkComponent<SavedEntity, Props extends SavedEntity>
  extends React.FC<Props> {
  headerCount(
    props: SavedEntity,
    collectedData: Record<string, unknown>,
    startHeaderIndex: number,
    preview: boolean,
    context: PageContext,
  ): Promise<number>;
  headers(
    props: Props,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ): Promise<
    {
      id: string;
      mainTitle?: string;
      subTitle?: string;
      linkText?: string;
    }[]
  >;
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
    preview: boolean,
    context?: PageContext,
  ) {
    const { type } = props;
    const LayoutComponent = links[type];
    if (LayoutComponent == null) {
      return Promise.resolve(0);
    }
    return LayoutComponent.headerCount(
      props,
      collectedData,
      startHeaderIndex,
      preview,
      context ?? {},
    );
  },
  headers(
    props: SafeValue<LayoutLinkProps>,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) {
    const { type } = props;
    const LayoutComponent = links[type];
    if (LayoutComponent?.headers == null) {
      return Promise.resolve([]);
    }
    return LayoutComponent.headers(props, collectedData, preview, context);
  },
});

export default LayoutLink;
