import useIsInitialRender from './useIsInitialRender';
import { useDeviceData } from 'react-device-detect';
import { createContext, useContext, useMemo } from 'react';

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
  userAgent,
}: {
  children: React.ReactNode;
  userAgent?: string;
}) {
  return (
    <context.Provider
      value={typeof window !== 'undefined' ? userAgent ?? '' : 'Next.JS/SSR'}
    >
      {children}
    </context.Provider>
  );
}

export default function useCurrentSystem(): typeof defaultSystem {
  const isInitial = useIsInitialRender();
  const { isMobile, isDesktop, browserName, osName } = useDeviceData(
    useContext(context),
  );
  return useMemo(() => {
    if (isInitial) {
      return defaultSystem;
    }
    let deviceType: 'mobile' | 'desktop' | null = null;
    if (isMobile) {
      deviceType = 'mobile';
    } else if (isDesktop) {
      deviceType = 'desktop';
    }
    return {
      browser: browserName,
      os: osName,
      deviceType,
    };
  }, [browserName, isDesktop, isInitial, isMobile, osName]);
}
