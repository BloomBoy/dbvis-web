import type { SafeEntryFields, SafeValue } from '../contentful';
import type { PickedProductRelease } from '../contentful/content/release/productRelease';
import type {
  PageContext,
  PageContextFeatureVersionFields,
  PageContextProductIndexFields,
} from '../contentful/pageContext';

type BaseGlobals = {
  stringSymbols: Record<string, string> | null;
  defaultProductIndex: SafeEntryFields.Entry<
    SafeValue<PageContextProductIndexFields>
  > | null;
  latestFeatureVersion: SafeEntryFields.Entry<
    SafeValue<PageContextFeatureVersionFields>
  > | null;
  latestProductRelease: SafeEntryFields.Entry<
    SafeValue<PickedProductRelease<'download'>>
  > | null;
};

export type WithGlobals<T = unknown> = {
  [key in keyof (T & BaseGlobals)]: (T & BaseGlobals)[key];
};

export type WithLayoutData<T = unknown> = T & {
  collectedData?: Record<string, unknown>;
  pageContext?: PageContext;
};
export interface SVGComponent {
  className?: string;
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
}
