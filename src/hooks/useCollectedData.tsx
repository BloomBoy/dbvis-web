import { AppProps } from 'next/app';
import { createContext, useContext } from 'react';
import { WithLayoutData } from 'src/utils/types';

const defaultData: Record<string, unknown> = {};

const CollectedDataContext = createContext(defaultData);

export function CollectedDataProvider<PageProps>({
  children,
  pageProps,
}: React.PropsWithChildren<AppProps<WithLayoutData<PageProps>>>) {
  const { collectedData } = pageProps;
  return (
    <CollectedDataContext.Provider
      value={
        typeof collectedData !== 'object' ||
        collectedData == null ||
        Array.isArray(collectedData)
          ? defaultData
          : (collectedData as Record<string, unknown>)
      }
    >
      {children}
    </CollectedDataContext.Provider>
  );
}

export default function useCollectedData(): Record<string, unknown>;
export default function useCollectedData<T>(key: string): T | undefined;
export default function useCollectedData<T>(key: string, defaultValue: T): T;
export default function useCollectedData<T>(
  key?: string,
  defaultValue?: T,
): Record<string, unknown> | T | undefined {
  const collectedData = useContext(CollectedDataContext);
  if (key == null) {
    return collectedData;
  }
  const ret = collectedData[key] as T | undefined;
  if (typeof ret === 'undefined') {
    return defaultValue;
  }
  return ret;
}
