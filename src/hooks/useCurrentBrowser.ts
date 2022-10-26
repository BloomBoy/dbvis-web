import useIsInitialRender from './useIsInitialRender';
import { isMobile, isDesktop, browserName, osName } from 'react-device-detect';
import { useMemo } from 'react';

const defaultSystem = {
  browser: null as string | null,
  os: null as string | null,
  deviceType: null as string | null,
};

export default function useCurrentSystem(): typeof defaultSystem {
  const isInitial = useIsInitialRender();
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
  }, [isInitial]);
}
