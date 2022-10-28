import React from 'react';
import Windows from './icons/Windows';
import Mac from './icons/MacOS';
import Linux from './icons/Linux';
import { OsTypes } from 'react-device-detect';

const OSComponent = {
  [OsTypes.Windows]: Windows,
  [OsTypes.MAC_OS]: Mac,
  Linux,
};

export type OS = keyof typeof OSComponent;

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
