import ColumnLayout from './layouts/ColumnLayout';
import { ComponentProps } from '../Component';
import React from 'react';
import SlideViewLayout from './layouts/SlideViewLayout';

export type SlotProps<Data = any> = {
  components: ComponentProps[];
  id: string;
  data: Data;
};

export type LayoutProps<Data = any, SlotData = any> = {
  data: Data;
  type: string;
  slots: SlotProps<SlotData>[];
  id: string;
};

const layouts: Record<string, React.ComponentType<LayoutProps> | undefined> = {
  ColumnLayout,
  SlideViewLayout,
};

export default function Layout(props: LayoutProps): JSX.Element | null {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return null;
  }
  return <LayoutComponent {...props} />;
}
