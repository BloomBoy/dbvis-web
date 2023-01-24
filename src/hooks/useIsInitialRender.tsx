import React, { createContext, useEffect, useState } from 'react';

const context = createContext(true);

export function InitialRenderProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    setInitialRender(false);
  }, []);
  return <context.Provider value={initialRender}>{children}</context.Provider>;
}

export default function useIsInitialRender() {
  return React.useContext(context);
}
