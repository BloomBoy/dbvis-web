import { OsTypes } from 'react-device-detect';

export const knownOSes = [
  'windows',
  'linux',
  'mac',
  'unix',
  'solaris',
  'aix',
  'hpux',
  'java',
] as const;
export type KnownOS = typeof knownOSes[number];

export const knownOsNameMap: Record<KnownOS, string> = {
  windows: 'Windows',
  linux: 'Linux',
  mac: 'macOS',
  unix: 'Unix',
  solaris: 'Solaris',
  aix: 'AIX',
  hpux: 'HP-UX',
  java: 'Java',
};

export function isKnownnOS(os: string): os is KnownOS {
  return knownOSes.includes(os as KnownOS);
}

export const browserOsMap: Record<string, KnownOS> = {
  [OsTypes.Windows]: 'windows',
  [OsTypes.MAC_OS]: 'mac',
  ['Linux']: 'linux',
};

export const archMap: Record<string, string | undefined> = {
  '64bit': '64-bit',
  '32bit': '32-bit',
  intel: 'Intel',
  apple: 'Apple Silicon',
};
