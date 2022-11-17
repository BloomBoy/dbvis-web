import React from 'react';
import Windows from './icons/Windows';
import Mac from './icons/MacOS';
import Linux from './icons/Linux';

const OSComponent = {
  windows: Windows,
  mac: Mac,
  linux: Linux,
};

export type OS = keyof typeof OSComponent;
export const supportedOs = Object.keys(OSComponent) as OS[];

export function hasOSIcon(os: string): os is OS {
  return supportedOs.includes(os as OS);
}

type GetBrowser = {
  os: OS;
  className?: string;
  style?: React.CSSProperties;
  size: number | string;
};
export default function OSIcon({ os, className, style, size }: GetBrowser) {
  const Component = OSComponent[os] ?? Windows;
  return (
    <Component
      className={className}
      style={{
        ...style,
        minWidth: size,
        minHeight: size,
      }}
      height={size}
      width={size}
    />
  );
}
