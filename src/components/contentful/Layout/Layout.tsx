import ColumnLayout from './layouts/ColumnLayout';
import React from 'react';
import SlideViewLayout from './layouts/SlideViewLayout';

import type { LayoutProps } from './types';

interface LayoutComponent<Props> extends React.FC<Props> {
  canRenderMainHeader?: boolean | ((props: Props) => boolean);
}

const layouts: Record<string, LayoutComponent<LayoutProps> | undefined> = {
  ColumnLayout,
  SlideViewLayout,
};

function LayoutComp(props: LayoutProps): JSX.Element | null {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return null;
  }
  return <LayoutComponent {...props} />;
}

const Layout = Object.assign(LayoutComp, {
  canRenderMainHeader(props: LayoutProps) {
    const { type } = props;
    const LayoutComponent = layouts[type];
    if (LayoutComponent == null) {
      return false;
    }
    if (typeof LayoutComponent.canRenderMainHeader === 'function') {
      return LayoutComponent.canRenderMainHeader(props);
    }
    return LayoutComponent.canRenderMainHeader ?? false;
  },
});

export default Layout;
