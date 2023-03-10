import useIsInitialRender from './useIsInitialRender';
import { useDeviceData } from 'react-device-detect';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppProps } from 'next/app';

const defaultSystem = {
  browser: null as string | null,
  os: null as string | null,
  deviceType: null as string | null,
};

const context = createContext(
  typeof window !== 'undefined' ? '' : 'Next.JS/SSR',
);

export function UserAgentProvider({
  children,
  ua: userAgent,
}: React.PropsWithChildren<AppProps> & { ua?: string }) {
  const [resolvedUa, setResolvedUa] = useState(
    typeof window !== 'undefined' ? userAgent ?? '' : 'Next.JS/SSR',
  );
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setResolvedUa((old) => (userAgent ?? window.navigator.userAgent) || old);
    }
  }, [userAgent]);
  return <context.Provider value={resolvedUa}>{children}</context.Provider>;
}

export default function useCurrentSystem(): typeof defaultSystem {
  const isInitial = useIsInitialRender();
  const ua = useContext(context);
  const { UA: UAParser } = useDeviceData(ua);
  return useMemo(() => {
    if (isInitial) {
      return defaultSystem;
    }
    return {
      browser: UAParser.getBrowser(),
      os: UAParser.getOS().name,
      deviceType: UAParser.getDevice().type ?? null,
    };
  }, [isInitial, UAParser]);
}
