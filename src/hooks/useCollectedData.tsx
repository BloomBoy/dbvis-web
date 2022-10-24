import { createContext, useContext } from 'react';

const defaultData: Record<string, unknown> = {};

const CollectedDataContext = createContext(defaultData);

export function CollectedDataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: unknown;
}) {
  return (
    <CollectedDataContext.Provider
      value={
        typeof data !== 'object' || data == null || Array.isArray(data)
          ? (data as Record<string, unknown>)
          : defaultData
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
  if (typeof ret !== undefined) {
    return defaultValue;
  }
  return ret;
}
