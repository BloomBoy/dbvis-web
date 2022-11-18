import { SafeValue } from 'src/utils/contentful';
import { PageContext } from 'src/utils/contentful/pageContext';
import { LayoutProps, SavedLayout } from '.';
import ColumnLayout from './layouts/ColumnLayout';
import SlideViewLayout from './layouts/SlideViewLayout';
import UnstyledLayout from './layouts/UnstyledLayout';

interface LayoutComponent<SavedEntity, Props extends SavedEntity>
  extends React.FC<Props> {
  headerCount?:
    | number
    | ((props: LayoutProps, collectedData: Record<string, unknown>) => number);
  headers?: (
    props: LayoutProps,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) =>
    | {
        id: string;
        mainTitle?: string;
        subTitle?: string;
        linkText?: string;
      }[]
    | null
    | undefined;
}

export const layouts: Record<
  string,
  LayoutComponent<SafeValue<SavedLayout>, LayoutProps> | undefined
> = {
  ColumnLayout,
  SlideViewLayout,
  UnstyledLayout,
};

export function layoutHeaderCount(
  props: SavedLayout,
  collectedData: Record<string, unknown>,
  startHeaderIndex: number,
) {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return 0;
  }
  if (typeof LayoutComponent.headerCount === 'function') {
    return LayoutComponent.headerCount(
      {
        ...props,
        mainHeaderIndex: startHeaderIndex,
      },
      collectedData,
    );
  }
  return LayoutComponent.headerCount ?? 0;
}

export function layoutHeaders(
  props: SavedLayout,
  collectedData: Record<string, unknown>,
  startHeaderIndex: number,
  preview: boolean,
  context: PageContext,
) {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return [];
  }
  return (
    LayoutComponent.headers?.(
      {
        ...props,
        mainHeaderIndex: startHeaderIndex,
      },
      collectedData,
      preview,
      context,
    ) ?? []
  );
}
