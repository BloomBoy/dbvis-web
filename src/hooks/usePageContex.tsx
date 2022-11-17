import { createContext, useContext } from 'react';
import { PageContext } from 'src/utils/contentful/pageContext';

const defaultData: PageContext = {};

const PageReactContext = createContext(defaultData);

export function PageContextProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: unknown;
}) {
  return (
    <PageReactContext.Provider
      value={
        typeof data !== 'object' || data == null || Array.isArray(data)
          ? defaultData
          : (data as Record<string, unknown>)
      }
    >
      {children}
    </PageReactContext.Provider>
  );
}

export default function usePageContext(): PageContext;
export default function usePageContext<Key extends keyof PageContext>(
  key: Key,
): PageContext[Key];
export default function usePageContext<Key extends keyof PageContext>(
  key: Key,
  defaultValue: NonNullable<PageContext[Key]>,
): NonNullable<PageContext[Key]>;
export default function usePageContext<Key extends keyof PageContext>(
  key?: Key,
  defaultValue?: PageContext[Key],
): PageContext | PageContext[Key] {
  const pageContext = useContext(PageReactContext);
  if (key == null) {
    return pageContext;
  }
  const ret = pageContext[key];
  if (typeof ret === 'undefined') {
    return defaultValue;
  }
  return ret;
}
