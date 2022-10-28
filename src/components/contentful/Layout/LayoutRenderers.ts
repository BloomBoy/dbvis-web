import { LayoutProps } from '.';
import ColumnLayout from './layouts/ColumnLayout';
import SlideViewLayout from './layouts/SlideViewLayout';

interface LayoutComponent<Props> extends React.FC<Props> {
  headerCount?:
    | number
    | ((props: Props, collectedData: Record<string, unknown>) => number);
}

export const layouts: Record<string, LayoutComponent<LayoutProps> | undefined> =
  {
    ColumnLayout,
    SlideViewLayout,
  };

export function layoutHeaderCount(
  props: LayoutProps,
  collectedData: Record<string, unknown>,
) {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return 0;
  }
  if (typeof LayoutComponent.headerCount === 'function') {
    return LayoutComponent.headerCount(props, collectedData);
  }
  return LayoutComponent.headerCount ?? 0;
}
