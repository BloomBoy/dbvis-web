import type { PageContext } from '../contentful/pageContext';

export type WithGlobals<T = unknown> = T &
  (
    | {
        preview: false;
      }
    | {
        preview: true;
        stringSymbols: Record<string, string>;
      }
  );

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
