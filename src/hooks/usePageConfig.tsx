import { AppProps } from 'next/app';
import React, { createContext } from 'react';
import { Props as HeaderProps } from 'src/components/PageLayout/navigation/Header/Header';

type PageConfig = Partial<{ headerMode: HeaderProps['behavior'] }>;

const empty: PageConfig = {};
const context = createContext(empty);

export function PageConfigProvider({
  children,
  appProps: { Component },
}: {
  children?: React.ReactNode;
  appProps: AppProps;
}) {
  const componentPageConfig = (
    Component as typeof Component & { pageConfig?: PageConfig }
  ).pageConfig;
  return (
    <context.Provider value={componentPageConfig ?? empty}>
      {children}
    </context.Provider>
  );
}

export default function usePageConfig() {
  return React.useContext(context);
}
