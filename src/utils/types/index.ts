export type WithGlobals<T> = T &
  (
    | {
        preview: false;
      }
    | {
        preview: true;
        stringSymbols: Record<string, string>;
      }
  );

export type WithCollectedData<T> = T & {
  collectedData?: Record<string, unknown>;
};
export interface SVGComponent {
  className?: string;
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
}
