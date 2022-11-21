import { SafeValue } from 'src/utils/contentful';
import { PageContext } from 'src/utils/contentful/pageContext';
import { LayoutProps, SavedLayout } from '.';
import ColumnLayout from './layouts/ColumnLayout';
import SlideViewLayout from './layouts/SlideViewLayout';
import UnstyledLayout from './layouts/UnstyledLayout';

interface LayoutComponent<SavedEntity, Props extends SavedEntity>
  extends React.FC<Props> {
  selfHeaderCount(
    props: LayoutProps,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ): number;
  headerCount(
    props: LayoutProps,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ): Promise<number>;
  headers(
    props: LayoutProps,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ): Promise<
    | {
        id: string;
        mainTitle?: string;
        subTitle?: string;
        linkText?: string;
      }[]
  >;
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
  preview: boolean,
  context?: PageContext,
) {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return Promise.resolve(0);
  }
  return LayoutComponent.headerCount(
    {
      ...props,
      mainHeaderIndex: startHeaderIndex,
    },
    collectedData,
    preview,
    context ?? {},
  );
}

export function layoutSelfHeaderCount(
  props: SavedLayout,
  collectedData: Record<string, unknown>,
  startHeaderIndex: number,
  preview: boolean,
  context: PageContext,
) {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return 0;
  }
  return LayoutComponent.selfHeaderCount(
    {
      ...props,
      mainHeaderIndex: startHeaderIndex,
    },
    collectedData,
    preview,
    context,
  );
}

export function layoutHeaders(
  props: LayoutProps,
  collectedData: Record<string, unknown>,
  preview: boolean,
  context: PageContext,
) {
  const { type } = props;
  const LayoutComponent = layouts[type];
  if (LayoutComponent == null) {
    return Promise.resolve([]);
  }
  return LayoutComponent.headers(props, collectedData, preview, context);
}
