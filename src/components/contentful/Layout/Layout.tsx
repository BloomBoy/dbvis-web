import React from 'react';

import type { LayoutProps } from './types';
import { layouts } from './LayoutRenderers';

export default function Layout(props: LayoutProps): JSX.Element | null {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return null;
  }
  return <LayoutComponent {...props} />;
}
