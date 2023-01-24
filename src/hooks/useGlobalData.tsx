import { AppProps } from 'next/app';
import React, { createContext, useContext, useMemo } from 'react';
import { fromEntries, objectEntries } from 'src/utils/objects';
import { WithGlobals } from 'src/utils/types';

const defaultData: {
  [key in keyof WithGlobals<unknown> &
    (string | symbol | number)]: WithGlobals<unknown>[key];
} = {
  defaultProductIndex: null,
  latestFeatureVersion: null,
  latestProductRelease: null,
  stringSymbols: null,
};

const GlobalDataContext = createContext(defaultData);

export function GlobalDataProvider<PageProps>({
  pageProps,
  children,
}: React.PropsWithChildren<AppProps<WithGlobals<PageProps>>>) {
  const globalData = useMemo(
    () =>
      fromEntries(
        objectEntries(defaultData).map((e) => {
          const value = pageProps[e[0]] ?? e[1];
          return [e[0], value] as typeof e;
        }),
      ),
    [pageProps],
  );
  return (
    <GlobalDataContext.Provider value={globalData}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export const useGlobalData = () => {
  return useContext(GlobalDataContext);
};
