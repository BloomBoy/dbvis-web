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
