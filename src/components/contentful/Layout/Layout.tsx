import ColumnLayout from './layouts/ColumnLayout';
import React from 'react';
import SlideViewLayout from './layouts/SlideViewLayout';

import type { LayoutProps } from './types';

interface LayoutComponent<Props> extends React.FC<Props> {
  headerCount?: number | ((props: Props) => number);
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
  headerCount(props: LayoutProps) {
    const { type } = props;
    const LayoutComponent = layouts[type];
    if (LayoutComponent == null) {
      return 0;
    }
    if (typeof LayoutComponent.headerCount === 'function') {
      return LayoutComponent.headerCount(props);
    }
    return LayoutComponent.headerCount ?? 0;
  },
});

export default Layout;
