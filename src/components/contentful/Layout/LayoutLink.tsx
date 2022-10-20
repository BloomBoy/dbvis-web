import type { LayoutLinkProps } from './types';
import React from 'react';
import { SafeValue } from 'src/utils/contentful';
import layoutBlockLink from './links/layoutBlockLink';

interface LinkComponent<Props> extends React.FC<Props> {
  headerCount?: number | ((props: Props) => number);
}

export const links: Record<
  string,
  LinkComponent<SafeValue<LayoutLinkProps>> | undefined
> = {
  layoutBlockLink,
};

function LayoutLinkComp(props: SafeValue<LayoutLinkProps>): JSX.Element | null {
  const { type } = props;
  const LinkComponent = links[type];
  if (LinkComponent == null) {
    return null;
  }
  return <LinkComponent {...props} />;
}

const LayoutLink = Object.assign(LayoutLinkComp, {
  headerCount(props: SafeValue<LayoutLinkProps>) {
    const { type } = props;
    const LayoutComponent = links[type];
    if (LayoutComponent == null) {
      return 0;
    }
    if (typeof LayoutComponent.headerCount === 'function') {
      return LayoutComponent.headerCount(props);
    }
    return LayoutComponent.headerCount ?? 0;
  },
});

export default LayoutLink;
